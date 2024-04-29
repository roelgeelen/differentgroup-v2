import {Route} from "@angular/router";
import {DynamicFormComponent} from "./dynamic-form/dynamic-form.component";
import {OverviewComponent} from "./overview/overview.component";
import {ViewConfigurationComponent} from "./view-configuration/view-configuration.component";
import {ConfigurationsComponent} from "./configurations.component";
import {canDeactivateGuard} from "../../_helpers/guards/can-deactivate.guard";
import {AllConfigurationsComponent} from "./all-configurations/all-configurations.component";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";

export const CONFIGURATIONS_ROUTES: Route[] = [
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
    component: AllConfigurationsComponent,
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
    component: ViewConfigurationComponent,
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
    component: DynamicFormComponent,
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

