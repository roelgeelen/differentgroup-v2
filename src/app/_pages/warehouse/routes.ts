import {Route} from "@angular/router";
import {AuthGuard} from "../../_auth/auth.guard";
import {EnumRoles} from "../../_auth/models/enumRoles";
import {LogisticComponent} from "./feature/logistic/logistic.component";
import {StockComponent} from "./feature/stock/stock.component";
import {ChecklistComponent} from "./feature/checklist/checklist.component";

export const routes: Route[] = [
  {
    path: 'logistic',
    component: LogisticComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.LOGISTIEK,
      ]
    }
  },
  {
    path: 'stock',
    component: StockComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.VOORRAAD,
      ]
    }
  },
  {
    path: 'checklist',
    component: ChecklistComponent,
    canActivate: [AuthGuard],
    data: {
      roles: [
        EnumRoles.CONTROLE,
      ]
    }
  },
];
