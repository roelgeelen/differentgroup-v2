import {Route} from "@angular/router";
import {DynamicFormComponent} from "./dynamic-form/dynamic-form.component";
import {OverviewComponent} from "./overview/overview.component";
import {ViewConfigurationComponent} from "./view-configuration/view-configuration.component";
import {ConfigurationsComponent} from "./configurations.component";
import {canDeactivateGuard} from "../../_helpers/guards/can-deactivate.guard";

export const CONFIGURATIONS_ROUTES: Route[] = [
  {
    path: '',
    component: ConfigurationsComponent,
  },
  {
    path: ':dealId',
    component: OverviewComponent,
  },
  {
    path: ':dealId/configurations/:configId',
    component: ViewConfigurationComponent,
  },
  {
    path: ':dealId/configurations/:configId/edit',
    component: DynamicFormComponent,
    canDeactivate: [canDeactivateGuard]
  }
];
