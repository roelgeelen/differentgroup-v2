import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./_pages/home/feature/home.component";
import {AuthGuard} from "./_auth/auth.guard";
import {EnumRoles} from './_auth/models/enumRoles';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'sales',
    loadChildren: () => import('./_pages/sales/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.AFSPRAKEN,
        EnumRoles.INMETEN,
        EnumRoles.FORMULIEREN
      ]
    }
  },
  {
    path: 'planning',
    loadChildren: () => import('./_pages/planning/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.PRODUCTIE,
        EnumRoles.GEPRODUCEERD,
        EnumRoles.TRACKING,
        EnumRoles.AFSPRAKEN,
      ]
    }
  },
  {
    path: 'warehouse',
    loadChildren: () => import('./_pages/warehouse/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.LOGISTIEK,
        EnumRoles.CONTROLE,
        EnumRoles.VOORRAAD,
      ]
    }
  },
  {
    path: 'reports',
    loadChildren: () => import('./_pages/reports/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.RAPPORTAGE,
        EnumRoles.FINANCIEEL,
      ]
    }
  },
  {
    path: 'customers',
    loadChildren: () => import('./_pages/configurations/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN,
        EnumRoles.FORMULIEREN_KLANT,
        EnumRoles.FORMULIEREN_BEKIJKEN,
      ]
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('./_pages/templates/routes').then(mod => mod.routes),
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    }
  },
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
