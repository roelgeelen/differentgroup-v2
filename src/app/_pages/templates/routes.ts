import {Route} from "@angular/router";
import {TemplateListComponent} from "./feature/template-list/template-list.component";
import {TemplateEditComponent} from "./feature/template-edit/template-edit.component";
import {canDeactivateGuard} from "../../_helpers/guards/can-deactivate.guard";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";

export const ADMIN_ROUTES: Route[] = [
  {
    path: 'forms',
    component: TemplateListComponent,
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
    component: TemplateEditComponent,
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
    component: TemplateEditComponent,
    canDeactivate: [canDeactivateGuard],
    canActivate : [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    }
  }
];
