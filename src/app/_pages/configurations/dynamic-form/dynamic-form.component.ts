import {Component, OnInit} from '@angular/core';
import {FormService} from "../../../_components/dynamic-form-builder/services/form.service";
import {AsyncPipe} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {FlexModule} from "@angular/flex-layout";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {SharedFormBuilderModule} from "../../../_components/dynamic-form-builder/components/shared-form-builder.module";
import {ApiCustomerService} from "../../../_services/api-customer.service";
import {
  IConfiguration,
  IConfigurationItem,
  IConfigurationItemValue
} from "../../../_models/configuration/configuration.interface";
import {User} from "../../../_auth/models/User";
import {AuthenticationService} from "../../../_auth/authentication.service";
import {MatInputModule} from "@angular/material/input";
import {IForm} from "../../../_components/dynamic-form-builder/models/form.interface";
import {UtilityService} from "../../../_components/dynamic-form-builder/services/utility.service";

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule,
    MatTabsModule,
    SharedFormBuilderModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FlexModule,
    MatInputModule,
    FormsModule,
    RouterLink
  ],
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  customerId: string = '';
  config: IConfiguration | null = null;
  tabIndex = 0;
  currentUser: User | undefined;
  editTitle: boolean = false;

  constructor(
    private authService: AuthenticationService,
    public formService: FormService,
    private route: ActivatedRoute,
    private apiCustomerService: ApiCustomerService,
    private utilityService: UtilityService
  ) {
    this.formService.setForm(null);
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(queryParams => {
      if (queryParams.get('configId') !== null) {
        this.customerId = queryParams.get('dealId')!;
        this.apiCustomerService.getConfiguration(this.customerId, queryParams.get('configId')!).subscribe(c => {
          this.config = c;
          this.formService.setForm(c.form, this.convertConfigurationToRawJson(this.config.values || []));
        });
      }
    });
  }

  get tabCount(): number {
    return this.formService.form$.getValue().pages.length;
  }

  public next() {
    window.scroll(0, 0);
    this.tabIndex = (this.tabIndex + 1) % this.tabCount;
  }

  public prev() {
    window.scroll(0, 0);
    this.tabIndex = (this.tabIndex - 1) % this.tabCount;
  }

  submit() {
    console.log(JSON.stringify(this.formService.form$.getValue()));
  }

  saveForm() {
    if (this.config) {
      // console.log(this.formService.formGroup$.getValue().getRawValue())
      this.config.updatedBy = this.currentUser?.name;
      this.config.values = this.generateConfigurationValue(this.formService.form$.getValue(), this.formService.formGroup$.getValue().getRawValue());
      console.log(this.config.values)
      this.apiCustomerService.updateConfiguration(this.customerId, this.config.id!, this.config).subscribe();
    }
  }

  generateConfigurationValue(form: IForm, values: any): IConfigurationItem[] {
    return form.pages.map((item) => {
      const newItem: IConfigurationItem = {page: item.tab ?? '', values: []};

      item.controls.forEach((control) => {
        const dep = this.utilityService.isShow(control);
        if (dep || control.options?.visibility?.showInConfiguration) {
          let shouldAddValue = false;

          if (control.type === 'Columns') {
            const columnValues: IConfigurationItemValue[] = [];
            control.columns?.forEach((column) => {
              column.container.controls.forEach((colControl) => {
                const colValue: IConfigurationItemValue = {
                  id: colControl.id,
                  type: colControl.type,
                  title: colControl.options?.title || colControl.options?.label || '',
                  subtitle: colControl.options?.subtitle || '',
                  value: values[colControl.id] || colControl.value || ''
                };

                if (this.shouldAddConfigurationItem(colValue)) {
                  shouldAddValue = true;
                  columnValues.push(colValue);
                }
              });
            });

            if (shouldAddValue) {
              newItem.values.push({
                id: control.id,
                title: control.options?.label || '',
                type: control.type,
                subtitle: control.options?.note,
                columns: columnValues
              });
            }
          } else {
            // console.log(values[control.id]);
            const value: IConfigurationItemValue = {
              id: control.id,
              type: control.type,
              title: control.options?.title || control.options?.label || '',
              subtitle: control.options?.subtitle || control.options?.note || '',
              value: values[control.id] || control.value || '',
            };
            if (this.shouldAddConfigurationItem(value)) {
              newItem.values.push(value);
            }
          }
        } else {
          console.log(control)
        }
      });

      return newItem;
    }).filter(item => item.values.length > 0);
  }

  shouldAddConfigurationItem(value: IConfigurationItemValue): boolean {
    if (value.value && ((value.value !== ''  && value.value.length > 0) || 'id' in value.value)) {
      return true;
    }

    return value.type === 'InfoBox' || value.type === 'Divider';
  }

  convertConfigurationToRawJson(configValues: IConfigurationItem[]): { [key: string]: string; } {
    const json3: {
      [key: string]: string;
    } = {};

    configValues.forEach((item) => {
      item.values.forEach((value) => {
        if ('columns' in value) {
          value.columns?.forEach((colValue) => {
            // @ts-ignore
            json3[colValue.id] = colValue.value;
          });
        } else {
          if (value.value != null) {
            // @ts-ignore
            json3[value.id] = value.value;
          }
        }
      });
    });

    return json3;
  }


}
