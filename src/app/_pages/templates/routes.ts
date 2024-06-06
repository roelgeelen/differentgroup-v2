import {Route} from "@angular/router";
import {canDeactivateGuard} from "../../_helpers/guards/can-deactivate.guard";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";

export const routes: Route[] = [
  {
    path: 'news',
    loadComponent: () => import('./feature/news-list/news-list.component').then((x) => x.NewsListComponent),
    // component: NewsListComponent,
    canActivate : [AuthGuard],
    data: {
      roles: [
        EnumRoles.BERICHTEN_BEHEREN,
      ]
    },
  },
  {
    path: 'news/create',
    loadComponent: () => import('./feature/news-edit/news-edit.component').then((x) => x.NewsEditComponent),
    // component: NewsEditComponent,
    canActivate : [AuthGuard],
    data: {
      roles: [
        EnumRoles.BERICHTEN_BEHEREN,
      ]
    },
  },
  {
    path: 'news/:id/edit',
    loadComponent: () => import('./feature/news-edit/news-edit.component').then((x) => x.NewsEditComponent),
    // component: NewsEditComponent,
    canActivate : [AuthGuard],
    data: {
      roles: [
        EnumRoles.BERICHTEN_BEHEREN,
      ]
    }
  },
  {
    path: 'forms',
    loadComponent: () => import('./feature/template-list/template-list.component').then((x) => x.TemplateListComponent),
    // component: TemplateListComponent,
    canActivate : [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    }
  },
  {
    path: 'forms/create',
    loadComponent: () => import('./feature/template-edit/template-edit.component').then((x) => x.TemplateEditComponent),
    // component: TemplateEditComponent,
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
    loadComponent: () => import('./feature/template-edit/template-edit.component').then((x) => x.TemplateEditComponent),
    // component: TemplateEditComponent,
    canDeactivate: [canDeactivateGuard],
    canActivate : [AuthGuard],
    data: {
      roles: [
        EnumRoles.FORMULIEREN_BEHEREN,
      ]
    }
  },
  {
    path: 'employees',
    loadComponent: () => import('./feature/employees/employees.component').then((x) => x.EmployeesComponent),
    // component: EmployeesComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.ONTWIKKELINGEN_BEHEREN,
      ]
    },
  },
  {
    path: 'roles',
    loadComponent: () => import('./feature/roles/roles.component').then((x) => x.RolesComponent),
    // component: RolesComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.ROLLEN_BEHEREN,
      ]
    },
  }
];
