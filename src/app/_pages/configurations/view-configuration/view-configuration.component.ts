import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {
  IConfiguration,
  IConfigurationItem,
  IConfigurationItemValue
} from "../../../_models/configuration/configuration.interface";
import {ApiCustomerService} from "../../../_services/api-customer.service";
import {SharedModule} from "../../../shared.module";
import {IFormControl} from "../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-view-configuration',
  templateUrl: './view-configuration.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    SharedModule,
    MatProgressSpinnerModule
  ],
  styleUrl: './view-configuration.component.scss'
})
export class ViewConfigurationComponent implements OnInit {
  configuration: IConfiguration | null = null;

  constructor(private apiCustomerService: ApiCustomerService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(queryParams => {
      if (queryParams.get('configId') !== null) {
        this.apiCustomerService.getConfiguration(queryParams.get('dealId')!, queryParams.get('configId')!).subscribe(c => {
          this.configuration = c;
          this.removeInvisibleItems()
        });
      }
    });
  }

  mapFormControls() {
    const controls: IFormControl[] = [];

    this.configuration?.form.pages.forEach((page) => {
      page.controls.forEach((control) => {
        if ('columns' in control) {
          control.columns?.forEach((colValue) => {
            if (colValue.container && colValue.container.controls) {
              controls.push(...colValue.container.controls);
            }
          });
        }
        controls.push(control);

      });
    });

    return controls;
  }

  parentFormControl(controls: IFormControl[], id: string) {
    return controls.find(control => control.id === id);
  }

  removeInvisibleItems() {
    const controls = this.mapFormControls();
    this.configuration?.values?.forEach((page) => {
      page.values = page.values.filter((value) => {
        const parent = this.parentFormControl(controls, value.id!);
        return !parent || parent.options?.visibility?.showInConfiguration;
      });
    });
  }


}
