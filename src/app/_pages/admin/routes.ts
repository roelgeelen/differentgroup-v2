import {Route} from "@angular/router";
import {OverviewComponent} from "./overview/overview.component";
import {BuilderComponent} from "./builder/builder.component";
import {canDeactivateGuard} from "../../_helpers/guards/can-deactivate.guard";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";

export const ADMIN_ROUTES: Route[] = [
  {
    path: 'forms',
    component: OverviewComponent,
    canActivate : [AuthGuard],
    data: {
      title: 'Beheer formulieren',
      showInNavbar: true,
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    }
  },
  {
    path: 'forms/create',
    component: BuilderComponent,
    canDeactivate: [canDeactivateGuard],
    canActivate : [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    }
  },
  {
    path: 'forms/:formId/builder',
    component: BuilderComponent,
    canDeactivate: [canDeactivateGuard],
    canActivate : [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    }
  }
];
