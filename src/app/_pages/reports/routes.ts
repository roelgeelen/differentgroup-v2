import {Route} from "@angular/router";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";

export const routes: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () => import('./feature/dashboard/dashboard.component').then((x) => x.DashboardComponent),
    // component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.RAPPORTAGE,
      ]
    }
  },
  {
    path: 'financieel',
    loadComponent: () => import('./feature/financial/financial.component').then((x) => x.FinancialComponent),
    // component: FinancialComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.FINANCIEEL,
      ]
    }
  },
];
