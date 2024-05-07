import {Route} from "@angular/router";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";
import {DashboardComponent} from "./feature/dashboard/dashboard.component";
import {InmetenComponent} from "./feature/inmeten/inmeten.component";

export const SALES_ROUTES: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.INMETEN,
      ]
    }
  },
  {
    path: 'inmeten',
    component: InmetenComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.INMETEN,
      ]
    }
  },
];
