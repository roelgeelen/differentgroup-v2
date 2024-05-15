import {Route} from "@angular/router";
import {TemplateListComponent} from "./feature/template-list/template-list.component";
import {TemplateEditComponent} from "./feature/template-edit/template-edit.component";
import {canDeactivateGuard} from "../../_helpers/guards/can-deactivate.guard";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";
import {NewsListComponent} from "./feature/news-list/news-list.component";
import {NewsEditComponent} from "./feature/news-edit/news-edit.component";

export const routes: Route[] = [
  {
    path: 'news',
    component: NewsListComponent,
    canActivate : [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    },
  },
  {
    path: 'news/create',
    component: NewsEditComponent,
    canActivate : [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    },
  },
  {
    path: 'news/:id/edit',
    component: NewsEditComponent,
    canActivate : [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    }
  },
  {
    path: 'forms',
    component: TemplateListComponent,
    canActivate : [AuthGuard],
    data: {
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
