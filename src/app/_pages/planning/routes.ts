import {Route} from "@angular/router";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";

export const routes: Route[] = [
  {
    path: 'production',
    loadComponent: () => import('./feature/production/production.component').then((x) => x.ProductionComponent),
    // component: ProductionComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.PRODUCTIE,
      ]
    }
  },
  {
    path: 'produced',
    loadComponent: () => import('./feature/produced/produced.component').then((x) => x.ProducedComponent),
    // component: ProducedComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.GEPRODUCEERD,
      ]
    }
  },
  {
    path: 'tracking',
    loadComponent: () => import('./feature/tracking/tracking.component').then((x) => x.TrackingComponent),
    // component: TrackingComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.TRACKING,
        EnumRoles.AFSPRAKEN,
      ]
    }
  },
  {
    path: 'stock',
    loadComponent: () => import('./feature/stock/stock.component').then((x) => x.StockComponent),
    // component: TrackingComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.TRACKING,
        EnumRoles.AFSPRAKEN,
      ]
    }
  },
];
