import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Lobby from './pages/lobby';
import BalloonPopPage from './pages/balloon-pop';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Lobby,
  },
  {
    path: '/balloon-pop',
    component: BalloonPopPage,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
