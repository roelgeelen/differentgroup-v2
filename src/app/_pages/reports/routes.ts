import {Route} from "@angular/router";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";
import {DashboardComponent} from "./feature/dashboard/dashboard.component";
import {FinancialComponent} from "./feature/financial/financial.component";

export const REPORTS_ROUTES: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.RAPPORTAGE,
      ]
    }
  },
  {
    path: 'financieel',
    component: FinancialComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.FINANCIEEL,
      ]
    }
  }
];
