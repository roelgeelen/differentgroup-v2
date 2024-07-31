import {Route} from "@angular/router";
import {canDeactivateGuard} from "../../_helpers/guards/can-deactivate.guard";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";


export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./feature/configurations.component').then((x) => x.ConfigurationsComponent),
    // component: ConfigurationsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.READ_CONFIGURATIONS,
        EnumRoles.SUPER_CONFIGURATIONS
      ]
    }
  },
  {
    path: 'search',
    loadComponent: () => import('./feature/customer-list/customer-list.component').then((x) => x.CustomerListComponent),
    // component: CustomerListComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.READ_CONFIGURATIONS,
        EnumRoles.SUPER_CONFIGURATIONS
      ]
    }
  },
  {
    path: ':dealId',
    loadComponent: () => import('./feature/customer-detail/customer-detail.component').then((x) => x.CustomerDetailComponent),
    // component: CustomerDetailComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.READ_CONFIGURATIONS,
        EnumRoles.SUPER_CONFIGURATIONS
      ]
    }
  },
  {
    path: ':dealId/configurations/:configId',
    loadComponent: () => import('./feature/configuration-detail/configuration-detail.component').then((x) => x.ConfigurationDetailComponent),
    // component: ConfigurationDetailComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.READ_CONFIGURATIONS,
        EnumRoles.SUPER_CONFIGURATIONS
      ]
    }
  },
  {
    path: ':dealId/configurations/:configId/edit',
    loadComponent: () => import('./feature/configuration-edit/configuration-edit.component').then((x) => x.ConfigurationEditComponent),
    // component: ConfigurationEditComponent,
    canDeactivate: [canDeactivateGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.EDIT_CONFIGURATIONS,
        EnumRoles.SUPER_CONFIGURATIONS
      ]
    }
  }
];

