import {Route} from "@angular/router";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";

export const routes: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () => import('./feature/dashboard/dashboard.component').then((x) => x.DashboardComponent),
    // component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.INMETEN,
      ]
    }
  },
  {
    path: "formulier",
    loadComponent: () => import('./feature/configurations-old/configurations-old.component').then((x) => x.ConfigurationsOldComponent),
    canActivate: [AuthGuard],
    // component: ConfigurationsOldComponent,
    data: {
      roles: [
        EnumRoles.FORMULIEREN,
        EnumRoles.FORMULIEREN_KLANT,
      ]
    }
  },
  {
    path: "formulier/:id",
    loadComponent: () => import('./feature/configurations-old/configurations-old.component').then((x) => x.ConfigurationsOldComponent),
    canActivate: [AuthGuard],
    // component: ConfigurationsOldComponent,
    data: {
      roles: [
        EnumRoles.FORMULIEREN,
        EnumRoles.FORMULIEREN_KLANT,
      ]
    }
  },
  {
    path: 'inmeten',
    loadComponent: () => import('./feature/inmeten/inmeten.component').then((x) => x.InmetenComponent),
    // component: InmetenComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.INMETEN,
      ]
    }
  },
  {
    path: "afspraken",
    loadComponent: () => import('./feature/agendas/agendas.component').then((x) => x.AgendasComponent),
    canActivate: [AuthGuard],
    // component: AgendasComponent,
    data: {
      roles: [
        EnumRoles.AFSPRAKEN,
      ]
    }
  }
];
