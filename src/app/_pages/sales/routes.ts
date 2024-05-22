import {Route} from "@angular/router";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";
import {DashboardComponent} from "./feature/dashboard/dashboard.component";
import {InmetenComponent} from "./feature/inmeten/inmeten.component";
import {redirectGuard} from "../../_helpers/guards/redirect.guard";
import {HomeComponent} from "../home/feature/home.component";
import {ConfigurationsOldComponent} from "./feature/configurations-old/configurations-old.component";
import {AgendasComponent} from "./feature/agendas/agendas.component";

export const routes: Route[] = [
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
    path: "formulier",
    canActivate: [AuthGuard],
    component: ConfigurationsOldComponent,
    data: {
      roles: [
        EnumRoles.FORMULIEREN,
        EnumRoles.FORMULIEREN_KLANT,
      ]
    }
  },
  {
    path: "formulier/:id",
    canActivate: [AuthGuard],
    component: ConfigurationsOldComponent,
    data: {
      roles: [
        EnumRoles.FORMULIEREN,
        EnumRoles.FORMULIEREN_KLANT,
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
  {
    path: "afspraken",
    canActivate: [AuthGuard],
    component: AgendasComponent,
    data: {
      roles: [
        EnumRoles.AFSPRAKEN,
      ]
    }
  }
];
