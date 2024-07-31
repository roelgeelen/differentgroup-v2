import {Route} from "@angular/router";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";

export const routes: Route[] = [
  {
    path: 'logistic',
    loadComponent: () => import('./feature/logistic/logistic.component').then((x) => x.LogisticComponent),
    // component: LogisticComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.VIEW_LOGISTICS,
      ]
    }
  },
  {
    path: 'stock',
    loadComponent: () => import('./feature/stock/stock.component').then((x) => x.StockComponent),
    // component: StockComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.VIEW_INVENTORY,
      ]
    }
  },
  {
    path: 'checklist',
    loadComponent: () => import('./feature/checklist/checklist.component').then((x) => x.ChecklistComponent),
    // component: ChecklistComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.READ_CHECKLIST,
      ]
    }
  },
];
