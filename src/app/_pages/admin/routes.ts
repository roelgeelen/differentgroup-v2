import { Route } from "@angular/router";
import { canDeactivateGuard } from "../../_helpers/guards/can-deactivate.guard";
import { AuthGuard } from "../../_auth/auth.guard";
import { EnumRoles } from "../../_auth/models/enumRoles";

// Helper function to reduce repetition
const authGuardWithRole = (roles: EnumRoles[]) => ({
  canActivate: [AuthGuard],
  data: { roles },
});

export const routes: Route[] = [
  {
    path: 'news',
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/news-list/news-list.component').then((x) => x.NewsListComponent),
        ...authGuardWithRole([EnumRoles.MANAGE_NEWS]),
      },
      {
        path: 'create',
        loadComponent: () => import('./feature/news-edit/news-edit.component').then((x) => x.NewsEditComponent),
        ...authGuardWithRole([EnumRoles.MANAGE_NEWS]),
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./feature/news-edit/news-edit.component').then((x) => x.NewsEditComponent),
        ...authGuardWithRole([EnumRoles.MANAGE_NEWS]),
      }
    ]
  },
  {
    path: 'forms',
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/template-list/template-list.component').then((x) => x.TemplateListComponent),
        ...authGuardWithRole([EnumRoles.MANAGE_FORMS]),
      },
      {
        path: 'create',
        loadComponent: () => import('./feature/template-edit/template-edit.component').then((x) => x.TemplateEditComponent),
        canDeactivate: [canDeactivateGuard],
        ...authGuardWithRole([EnumRoles.MANAGE_FORMS]),
      },
      {
        path: ':formId/builder',
        loadComponent: () => import('./feature/template-edit/template-edit.component').then((x) => x.TemplateEditComponent),
        canDeactivate: [canDeactivateGuard],
        ...authGuardWithRole([EnumRoles.MANAGE_FORMS]),
      }
    ]
  },
  {
    path: 'employees',
    children: [
      {
        path: '',
        loadComponent: () => import('./feature/employees/employees.component').then((x) => x.EmployeesComponent),
        ...authGuardWithRole([EnumRoles.READ_EMPLOYEES]),
      },
      {
        path: ':id',
        loadComponent: () => import('./feature/employees-detail/employees-detail.component').then((x) => x.EmployeesDetailComponent),
        ...authGuardWithRole([EnumRoles.READ_EMPLOYEES]),
      },
      {
        path: ':id/conversations',
        ...authGuardWithRole([EnumRoles.MANAGE_CONVERSATIONS]),
        children: [
          {
            path: 'create',
            loadComponent: () => import('./feature/conversation-edit/conversation-edit.component').then((x) => x.ConversationEditComponent),
          },
          {
            path: ':conId',
            loadComponent: () => import('./feature/conversation-detail/conversation-detail.component').then((x) => x.ConversationDetailComponent),
          },
          {
            path: ':conId/edit',
            loadComponent: () => import('./feature/conversation-edit/conversation-edit.component').then((x) => x.ConversationEditComponent),
          }
        ]
      }
    ]
  },
];
