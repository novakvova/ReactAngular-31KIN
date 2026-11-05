import { Routes } from '@angular/router';

export const TESTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/test-list/test-list.component').then((m) => m.TestList),
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/test-create/test-create.component').then((m) => m.TestCreate),
  },
  {
    path: ':id/take',
    loadComponent: () => import('./pages/test-take/test-take').then((m) => m.TestTake),
  },
];
