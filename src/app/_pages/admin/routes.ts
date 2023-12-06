import {Route} from "@angular/router";
import {OverviewComponent} from "./overview/overview.component";
import {BuilderComponent} from "./builder/builder.component";

export const ADMIN_ROUTES: Route[] = [
  {
    path: 'forms',
    component: OverviewComponent,
  },
  {
    path: 'forms/create',
    component: BuilderComponent,
  },
  {
    path: 'forms/:formId/builder',
    component: BuilderComponent,
  }
];
