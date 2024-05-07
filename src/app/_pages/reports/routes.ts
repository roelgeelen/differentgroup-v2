import {Route} from "@angular/router";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";
import {DashboardComponent} from "./feature/dashboard/dashboard.component";
import {FinancialComponent} from "./feature/financial/financial.component";

export const routes: Route[] = [
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
  },
  {
    path: 'tracking',
    component: FinancialComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.TRACKING,
        EnumRoles.AFSPRAKEN,
      ]
    }
  }
];
