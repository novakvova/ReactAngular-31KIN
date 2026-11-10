# Специфікація проєкту MyAuto

## 1. Призначення

Навчальний SPA-застосунок на Angular, який поєднує три функціональні частини:

1. **Головна сторінка** — лендинг продавця комерційних авто (фургони, рефрижератори, бортові): слайдер, каталог авто, контакти, графік роботи, карта Google Maps.
2. **Автентифікація** — вхід і реєстрація через зовнішній REST API.
3. **Тести (TestHub)** — створення тестів із питаннями й варіантами відповідей, проходження з таймером, підрахунок балів та історія спроб. Дані зберігаються в `localStorage`.

Мова інтерфейсу та коментарів у коді — українська.

## 2. Технології та залежності

| Категорія | Технологія | Версія |
|---|---|---|
| Фреймворк | Angular (`core`, `common`, `forms`, `router`, `platform-browser`, `compiler`) | ^22.2 |
| Мова | TypeScript | ~6.0 |
| Реактивність | RxJS (HTTP-запити) + Angular Signals (стан компонентів) | ~7.8 |
| Стилі | Tailwind CSS v4 через `@tailwindcss/postcss` | ^4.1 |
| Збірка | `@angular/build` (esbuild, builder `application`) | ^22.2 |
| Тести | Vitest + jsdom (builder `@angular/build:unit-test`) | ^5.0 / ^30.0 |
| Форматування | Prettier (100 символів, одинарні лапки, парсер `angular` для HTML) | ^3.8 |
| Пакетний менеджер | npm | 11.19 |

Сторонніх UI-бібліотек, state-менеджерів (NgRx тощо) і лінтера немає.

### Скрипти

| Команда | Дія |
|---|---|
| `npm start` | `ng serve`, конфігурація `development`, http://localhost:4200 |
| `npm run build` | production-збірка в `dist/` |
| `npm run watch` | development-збірка в режимі watch |
| `npm test` | запуск unit-тестів Vitest |
| `ng test --include <шлях до spec>` | запуск одного spec-файлу |

### Обмеження збірки (production)

- Початковий бандл: попередження від 500 kB, помилка від 1 MB.
- CSS одного компонента: попередження від 4 kB, помилка від 8 kB.
- `outputHashing: all`.

## 3. Структура проєкту

```
my-auto/
├── public/assets/         # статичні зображення (hero-слайди, фото авто)
├── src/
│   ├── main.ts            # bootstrapApplication(App, appConfig)
│   ├── styles.css         # @import 'tailwindcss'
│   ├── environments/      # environment.ts (prod) / environment.development.ts
│   └── app/
│       ├── app.ts|html    # кореневий компонент, лише <router-outlet />
│       ├── app.config.ts  # провайдери: router, global error listeners
│       ├── app.routes.ts  # кореневі маршрути з lazy loading
│       ├── core/
│       │   ├── models/    # User
│       │   └── services/  # AuthService, TokenStorageService, TestStorageService
│       ├── features/
│       │   ├── auth/      # login, register + DTO-моделі + auth.routes.ts
│       │   ├── home/      # лендинг + home.routes.ts
│       │   └── tests/     # test-list, test-create, test-take + сутності + tests.routes.ts
│       └── shared/
│           └── validators/ # passwordMatchValidator
```

### Шари

- **core** — сервіси та моделі, спільні для всього застосунку.
- **features** — окремі функціональні модулі. Кожен має `pages/`, за потреби `models/`, і свій файл маршрутів.
- **shared** — перевикористовувані утиліти (валідатори).

### Іменування

Файли генеруються через Angular CLI із явним `--type`: `*.component.ts`, `*.service.ts`, `*.model.ts`, `*.validator.ts`. Сутності тестів названо `*.entity.ts`. Аліас імпорту `@/*` вказує на `src/app/*`.

## 4. Маршрутизація

Усі маршрути завантажуються ліниво: функціональний модуль підключається через `loadChildren`, а сторінка — через `loadComponent`.

| URL | Компонент | Опис |
|---|---|---|
| `/` | `HomeComponent` | лендинг |
| `/auth` | — | редірект на `/auth/login` |
| `/auth/login` | `LoginComponent` | вхід |
| `/auth/register` | `RegisterComponent` | реєстрація |
| `/tests` | `TestListComponent` | список тестів, найкращий результат, видалення |
| `/tests/new` | `TestCreateComponent` | конструктор тесту |
| `/tests/:id/take` | `TestTakeComponent` | проходження тесту |
| `**` | — | редірект на `/` |

Guard-ів і resolver-ів немає.

## 5. Основні архітектурні рішення

### 5.1 Standalone-компоненти без NgModules
Залежності кожного компонента перелічені в його `imports`. Застосунок запускається через `bootstrapApplication`, а провайдери задаються в `app.config.ts`.

### 5.2 Сервіси через `@Service()` та `inject()`
Сервіси позначено декоратором `@Service()` з Angular 22 (замість `@Injectable({ providedIn: 'root' })`). Залежності отримуються функцією `inject()` у полях класу, а не через конструктор.

### 5.3 Стан на Signals
Локальний стан компонентів зберігається в `signal()`, а похідні значення обчислюються через `computed()`: прогрес, відсоток результату, таймер. RxJS використовується лише для HTTP. `HomeComponent` працює з `ChangeDetectionStrategy.OnPush`.

### 5.4 Реактивні форми
- Login і Register використовують `inject(FormBuilder).nonNullable`, синхронні валідатори та груповий валідатор `passwordMatchValidator`.
- `TestCreateComponent` будує динамічну форму з вкладеними `FormArray`: тест → питання → варіанти. Діють такі правила:
  - назва тесту до 200 символів, опис до 1000, ліміт часу від 1 до 600 хвилин;
  - текст питання до 1000 символів, бали від 1 до 100;
  - текст варіанта до 500 символів, мінімум 2 варіанти, хоча б один правильний (валідатор `atLeastOneCorrect`).
- Помилки показуються після `touched` або після першої спроби зберегти форму.

### 5.5 Два джерела даних

**а) Автентифікація — віддалений API**
- `AuthService` виконує `POST {apiUrl}/account/login` і `POST {apiUrl}/account/register`.
- Отриманий `accessToken` зберігається в `localStorage` під ключем `access_token` через `TokenStorageService`.
- `isLoggedIn()` лише перевіряє, чи є токен.
- `apiUrl` береться з environment. Для розробки це `https://qrcode31kn-api.itstep.click/api`, у production-конфігурації стоїть заглушка.
- Контракт відповіді: `AuthResponse { accessToken, refreshToken?, user: User }`.

**б) Тести — `localStorage` як локальна «БД»**

`TestStorageService` імітує репозиторій зі схемою, схожою на EF Core:

| Ключ | Вміст |
|---|---|
| `testhub.tests` | масив тестів із вкладеними питаннями та варіантами |
| `testhub.attempts` | масив спроб проходження |
| `testhub.seq` | лічильники автоінкременту `{ test, question, option, attempt }` |

- `create()` призначає `id`, зовнішні ключі (`testId`, `questionId`) та `orderIndex` для всього дерева.
- Під час читання прості JSON-об'єкти перетворюються назад в екземпляри класів сутностей, рядкові дати — у `Date`, а питання й варіанти сортуються за `orderIndex`.
- `delete()` видаляє тест разом з усіма його спробами.
- Помилки читання чи запису в `localStorage` перехоплюються. При помилці читання повертається значення за замовчуванням, при помилці запису пише `console.error`.

### 5.6 Доменна модель тестів

```
TestEntity 1 ──< QuestionEntity 1 ──< AnswerOptionEntity
     1
     └──< TestAttemptEntity
```

- Сутності є **класами зі значеннями за замовчуванням**, а не інтерфейсами, тож їх можна створювати через `new`. JSDoc-коментарі описують серверні обмеження (`MaxLength`, `Range`, FK).
- Навігаційні властивості (`question.test`, `option.question`) у сховище не потрапляють.
- `TestAttemptEntity.answers` має тип `Record<questionId, optionId[]>`.
- Сутності експортуються через barrel-файл `features/tests/models/index.ts`.

### 5.7 Логіка оцінювання
- Питання зараховується лише тоді, коли множина обраних варіантів **точно збігається** з множиною правильних. Часткових балів немає.
- Якщо правильних варіантів більше одного, в інтерфейсі питання стає multiple choice (checkbox), інакше single choice.
- `evaluate()` рахує `score` і `maxScore` (суму `points`) та прапорець `timedOut`.
- Таймер у `TestTakeComponent` працює на `setInterval` і автоматично надсилає відповіді, коли час вичерпано. Інтервал очищується в `ngOnDestroy`.
- Після здачі інтерфейс підсвічує правильні та хибні відповіді, а тест можна пройти повторно.

### 5.8 Головна сторінка
Контент статичний і задається масивами в компоненті: слайди, авто, телефони, графік. Слайдер перемикається автоматично кожні 6 секунд, а після ручного перемикання таймер запускається заново. Каталог гортається горизонтально через `scrollBy`. Для iframe з картою URL позначено безпечним через `DomSanitizer.bypassSecurityTrustResourceUrl`.

### 5.9 Стилізація
Компоненти стилізуються утилітними класами Tailwind у шаблонах. CSS-файли компонентів здебільшого порожні або мінімальні. Динамічні класи (наприклад, підсвічування відповідей) повертають методи компонента.

## 6. Тестування

- Для кожного компонента й сервісу є spec-файл від CLI, де перевіряється лише створення екземпляра (`should create`).
- Середовище: Vitest з глобальними `describe` / `it` / `expect` (`vitest/globals` у `tsconfig.spec.json`) і DOM-середовищем jsdom.
- Бізнес-логіку `TestStorageService` (оцінювання, автоінкремент, відновлення об'єктів) тести поки не покривають.

## 7. Відомі обмеження та технічний борг

- **Немає HTTP-interceptor-а**, тож токен не додається до запитів. Також немає route guards: сторінки `/tests` доступні без входу.
- Немає виходу з системи в інтерфейсі, а `refreshToken` не використовується.
- Production `apiUrl` — заглушка (`https://api.your-domain.com/api`).
- У `tsconfig.json` не ввімкнено `strict: true`. У `TestStorageService` і `TestCreateComponent` трапляється тип `any`.
- Деякі імпорти використовують відносні шляхи (`../../../../core/...`) замість аліасу `@/`.
- Тести зберігаються лише локально в браузері, без синхронізації з бекендом. Редагування тестів не реалізовано.
- Дані головної сторінки зашиті в код компонента.
- Лінтер не налаштовано.
