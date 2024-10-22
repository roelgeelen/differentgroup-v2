import { Routes} from '@angular/router';
import {AuthGuard} from "./_auth/auth.guard";
import {EnumRoles} from './_auth/models/enumRoles';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./_pages/home/feature/home.component').then((x) => x.HomeComponent),
    // canActivate:[AuthGuard]
    // component: HomeComponent,
  },
  {
    path: 'sales',
    loadChildren: () => import('./_pages/sales/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.READ_APPOINTMENTS,
        EnumRoles.READ_CONFIGURATIONS,
        EnumRoles.SUPER_CONFIGURATIONS,
        EnumRoles.VIEW_SALES,
        // EnumRoles.AFSPRAKEN,
        // EnumRoles.INMETEN,
        // EnumRoles.FORMULIEREN
      ]
    }
  },
  {
    path: 'planning',
    loadChildren: () => import('./_pages/planning/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.VIEW_PRODUCTION,
        EnumRoles.VIEW_PRODUCED,
        EnumRoles.VIEW_TRACKING,
        EnumRoles.VIEW_INVENTORY,//TODO: same as magazijn
        // EnumRoles.PRODUCTIE,
        // EnumRoles.GEPRODUCEERD,
        // EnumRoles.TRACKING,
        // EnumRoles.AFSPRAKEN,
      ]
    }
  },
  {
    path: 'warehouse',
    loadChildren: () => import('./_pages/warehouse/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.VIEW_LOGISTICS,
        EnumRoles.READ_CHECKLIST,
        EnumRoles.VIEW_INVENTORY,
        // EnumRoles.LOGISTIEK,
        // EnumRoles.CONTROLE,
        // EnumRoles.VOORRAAD,
      ]
    }
  },
  {
    path: 'reports',
    loadChildren: () => import('./_pages/reports/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.VIEW_REPORTS,
        EnumRoles.VIEW_FINANCIAL,
        // EnumRoles.RAPPORTAGE,
        // EnumRoles.FINANCIEEL,
      ]
    }
  },
  {
    path: 'customers',
    loadChildren: () => import('./_pages/configurations/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.READ_CONFIGURATIONS,
        EnumRoles.SUPER_CONFIGURATIONS,
        // EnumRoles.FORMULIEREN,
        // EnumRoles.FORMULIEREN_KLANT,
        // EnumRoles.FORMULIEREN_BEKIJKEN,
      ]
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('./_pages/admin/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.MANAGE_FORMS,
        EnumRoles.READ_EMPLOYEES,
        EnumRoles.MANAGE_NEWS
        // EnumRoles.FORMULIEREN_BEHEREN,
      ]
    }
  },
  {path: '**', redirectTo: ''},
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {
// }
