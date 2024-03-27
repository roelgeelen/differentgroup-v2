import {Route} from "@angular/router";
import {OverviewComponent} from "./overview/overview.component";
import {BuilderComponent} from "./builder/builder.component";
import {canDeactivateGuard} from "../../_helpers/guards/can-deactivate.guard";

export const ADMIN_ROUTES: Route[] = [
  {
    path: 'forms',
    component: OverviewComponent,
  },
  {
    path: 'forms/create',
    component: BuilderComponent,
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: 'forms/:formId/builder',
    component: BuilderComponent,
    canDeactivate: [canDeactivateGuard]
  }
];
