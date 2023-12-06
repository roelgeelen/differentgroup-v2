import {Route} from "@angular/router";
import {DynamicFormComponent} from "./dynamic-form/dynamic-form.component";
import {OverviewComponent} from "./overview/overview.component";

export const CONFIGURATIONS_ROUTES: Route[] = [
  {
    path: '',
    component: OverviewComponent,
  },
  {
    path: ':formId',
    component: DynamicFormComponent,
  }
];
