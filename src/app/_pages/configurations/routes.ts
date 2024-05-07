import {Route} from "@angular/router";
import {OverviewComponent} from "./feature/customer-detail/customer-detail.component";
import {ConfigurationsComponent} from "./feature/configurations.component";
import {canDeactivateGuard} from "../../_helpers/guards/can-deactivate.guard";
import {CustomerListComponent} from "./feature/customer-list/customer-list.component";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";
import {ConfigurationEditComponent} from "./feature/configuration-edit/configuration-edit.component";
import {ConfigurationDetailComponent} from "./feature/configuration-detail/configuration-detail.component";

export const routes: Route[] = [
  {
    path: '',
    component: ConfigurationsComponent,
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
    path: 'search',
    component: CustomerListComponent,
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
    path: ':dealId',
    component: OverviewComponent,
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
    path: ':dealId/configurations/:configId',
    component: ConfigurationDetailComponent,
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
    path: ':dealId/configurations/:configId/edit',
    component: ConfigurationEditComponent,
    canDeactivate: [canDeactivateGuard],
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN,
        EnumRoles.FORMULIEREN_KLANT,
      ]
    }
  }
];

