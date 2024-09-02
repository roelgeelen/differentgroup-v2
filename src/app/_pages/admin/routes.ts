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
        EnumRoles.MANAGE_NEWS,
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
        EnumRoles.MANAGE_NEWS,
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
        EnumRoles.MANAGE_NEWS,
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
        EnumRoles.MANAGE_FORMS,
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
        EnumRoles.MANAGE_FORMS,
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
        EnumRoles.MANAGE_FORMS,
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
];
