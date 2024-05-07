import {Route} from "@angular/router";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";
import {ProductionComponent} from "./feature/production/production.component";
import {ProducedComponent} from "./feature/produced/produced.component";
import {TrackingComponent} from "./feature/tracking/tracking.component";

export const routes: Route[] = [
  {
    path: 'production',
    component: ProductionComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.PRODUCTIE,
      ]
    }
  },
  {
    path: 'produced',
    component: ProducedComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.GEPRODUCEERD,
      ]
    }
  },
  {
    path: 'tracking',
    component: TrackingComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.TRACKING,
        EnumRoles.AFSPRAKEN,
      ]
    }
  },
];
