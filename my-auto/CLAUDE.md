# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
Використовуй короткі відповіді, без зайвого коду, лише важлива інформація!

Перед рефакторингом і роботою з кодом завжди читай файл @spec.md

## Commands

- `npm start` / `ng serve` — dev server at http://localhost:4200 (default config is `development`, which swaps in `environment.development.ts`)
- `npm run build` / `ng build` — production build to `dist/` (budgets: 500kB warn / 1MB error initial; 4kB warn / 8kB error per component stylesheet)
- `npm test` / `ng test` — unit tests via Vitest (`@angular/build:unit-test`, jsdom, `vitest/globals`)
- Single spec: `ng test --include src/app/core/services/test-storage.service.spec.ts`
- One-shot run (no watch): `ng test --watch=false`
- Formatting: Prettier (`npx prettier --write <files>`) — 100 cols, single quotes, `angular` parser for `.html`. No linter is configured.

Scaffolding follows the conventions in README.md, e.g. `ng g c features/<feature>/pages/<name> --type=component`, `ng generate service core/services/<name>.service`, `ng g interface features/<feature>/models/<name> --type=model`. Note the explicit `--type` flags: files are named `*.component.ts`, `*.service.ts`, `*.model.ts`, `*.validator.ts`.

## Stack

Angular 22 (standalone components, no NgModules), TypeScript 6, RxJS 7, Tailwind CSS v4 (via `@tailwindcss/postcss`, imported in `src/styles.css`; styling is done with Tailwind utility classes in templates). Code comments and UI text are in Ukrainian.

## Architecture

- **Path alias**: `@/*` → `src/app/*` (tsconfig.json). Prefer `@/core/...`, `@/features/...` imports.
- **Layout**: `core/` (app-wide services and models), `features/<feature>/` (`pages/`, `models/`, and a `<feature>.routes.ts`), `shared/` (reusable validators etc.).
- **Routing**: `app.routes.ts` lazy-loads each feature's route array (`AUTH_ROUTES`, `TESTS_ROUTES`, `HOME_ROUTES`) via `loadChildren`; each feature route lazy-loads page components via `loadComponent`. New features should follow the same pattern. Unknown paths redirect to `''` (home).
- **Services** use Angular 22's `@Service()` decorator (not `@Injectable`) and `inject()` for DI — no constructor injection.
- **Components** use signals (`signal`, `computed`) for state, `inject()` for dependencies, and typed reactive forms via `inject(FormBuilder).nonNullable`.

### Two data backends

1. **Auth → remote API.** `AuthService` posts to `${environment.apiUrl}/account/login|register` and stores `accessToken` in localStorage through `TokenStorageService` (`access_token` key). The dev API URL is in `src/environments/environment.development.ts`; the production `environment.ts` URL is a placeholder. There is currently no HTTP interceptor attaching the token and no route guards.
2. **Tests (quizzes) → localStorage only.** `TestStorageService` (`core/services/test-storage.service.ts`) is the whole persistence layer for the `tests` feature:
   - Keys: `testhub.tests`, `testhub.attempts`, `testhub.seq` (per-entity auto-increment counters for test/question/option/attempt ids).
   - `create()` assigns ids, foreign keys (`testId`, `questionId`) and `orderIndex` for the whole question/option tree.
   - Reads "revive" plain JSON back into entity class instances and convert date strings to `Date`; questions/options are sorted by `orderIndex`.
   - Scoring: a question counts only if the selected option ids exactly equal the set of correct ids; a question with >1 correct option is treated as multi-select in the UI.
   - Deleting a test also deletes its attempts.

### Models

`features/tests/models/*.entity.ts` are **classes with defaults** (not interfaces), mirroring a backend EF-style schema — doc comments note the intended server constraints (MaxLength, Range, FK). Navigation properties (`test`, `question`) are not persisted. Import them through the barrel `features/tests/models/index.ts`. Auth/user models are plain interfaces (`*.model.ts`).

A fuller description of the project (routes table, domain model, known tech debt) is in `spec.md` — keep it in sync when architecture changes.

## Coding rules

- **Language**: all UI text, error messages and code comments in Ukrainian; identifiers in English.
- **Components**: standalone only (no NgModules, no `standalone: true` needed). Always use separate `templateUrl` / `styleUrl` files. Selector prefix `app-`. Prefer `ChangeDetectionStrategy.OnPush` for new components.
- **DI**: `inject()` in `private readonly` fields; never constructor parameters.
- **State**: `signal()` for mutable component state, `computed()` for derived values, `.set()`/`.update()` with immutable updates (spread new objects/arrays, don't mutate signal contents). Use RxJS only where Angular APIs return Observables (HTTP); don't introduce `BehaviorSubject` stores or NgRx.
- **Templates**: built-in control flow (`@if`, `@for` with `track`, `@switch`), not `*ngIf`/`*ngFor`. Styling via Tailwind utility classes in the template; keep component `.css` files empty or minimal (component style budget is 4kB). Conditional classes may come from a component method (see `optionClass` in `test-take`).
- **Forms**: reactive forms only (`ReactiveFormsModule`), typed — use `inject(FormBuilder).nonNullable` where nullable values aren't needed. Validation limits must match the entity doc comments (MaxLength/Range). On submit: if invalid → `markAllAsTouched()` and return. Show errors when `touched` or after a submit attempt. Reusable validators go in `shared/validators/` as plain `ValidatorFn` functions; form-specific ones may live in the component file.
- **Async UI pattern**: `loading` and `errorMessage` signals; on HTTP error show `err?.error?.message ?? '<Ukrainian fallback>'` and reset `loading`.
- **Types**: avoid `any` (tsconfig is not `strict`, so the compiler won't catch it). Use `interface` for API DTOs (`*.model.ts`) and `class` with defaults for domain entities (`*.entity.ts`).
- **Imports**: use the `@/` alias for anything outside the current feature; relative paths only within the same feature (e.g. `../../models`).
- **Timers/subscriptions**: anything started with `setInterval`/`setTimeout` must be cleared in `ngOnDestroy`.
- Run Prettier on changed files before finishing.

## Architecture rules

- New functionality goes into `features/<name>/` with its own `<name>.routes.ts` exporting `<NAME>_ROUTES`, registered in `app.routes.ts` via `loadChildren`; pages registered via `loadComponent`. Never import feature pages eagerly.
- Place code by scope: used across features → `core/` (services, shared models); reusable UI-agnostic helpers → `shared/`; everything else stays inside the feature.
- Components don't touch `localStorage` or `HttpClient` directly — go through a service in `core/services/`. Keep business logic (scoring, id generation, data shaping) in services, components only orchestrate UI.
- localStorage access must stay wrapped in try/catch (pattern: `read()`/`write()` in `TestStorageService`), and data read back must be revived into entity instances with `Date` fields restored.
- New localStorage keys for the tests feature use the `testhub.` prefix; new ids come from `nextId()`, not `Date.now()`/random.
- API base URLs come only from `environment.apiUrl`; add new endpoints as methods on a service that builds `${environment.apiUrl}/<resource>`.
- If adding an HTTP interceptor or route guards, register them in `app.config.ts` (`provideHttpClient(withInterceptors([...]))`, functional guards) — no class-based interceptors/guards.

## Testing rules

- Every new component/service gets a co-located `*.spec.ts` (CLI generates it). Use Vitest globals (`describe`, `it`, `expect`, `vi`) — no Jasmine/Karma APIs (`jasmine.createSpy`, `spyOn` → use `vi.fn()` / `vi.spyOn()`).
- Services: obtain via `TestBed.inject()`. For services using `HttpClient`, add `provideHttpClient()` and `provideHttpClientTesting()` and verify requests with `HttpTestingController`.
- Components: `TestBed.configureTestingModule({ imports: [Component], providers: [provideRouter([])] })`; mock services with `{ provide: X, useValue: {...} }`.
- localStorage-backed logic: call `localStorage.clear()` in `beforeEach` (jsdom provides localStorage).
- Timers (test-take countdown, home slider): use `vi.useFakeTimers()` / `vi.advanceTimersByTime()` and restore with `vi.useRealTimers()`.
- Priority for meaningful tests beyond "should create": `TestStorageService.isQuestionCorrect`/`evaluate` (exact-match scoring, multi-select), id sequencing and FK assignment in `create()`, cascade delete of attempts, revive of dates/order; form validators (`passwordMatchValidator`, `atLeastOneCorrect`); auto-submit on timeout.
- Run `ng test --watch=false` and make sure it passes before considering a change done.
