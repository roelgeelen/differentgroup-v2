import {Component, OnInit} from '@angular/core';
import {FormService} from "../../../_components/dynamic-form-builder/services/form.service";
import {AsyncPipe, NgIf} from "@angular/common";
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
import {MatDialog} from "@angular/material/dialog";
import {MatSidenavModule} from "@angular/material/sidenav";
import {QuotationComponent} from "./quotation/quotation.component";
import {PreviewDialogComponent} from "./preview-dialog/preview-dialog.component";
import {IFieldChange, IConfigChanges} from "../../../_models/configuration/configuration-change.interface";
import {ApiConfigurationService} from "../../../_services/api-configuration.service";
import {FormPageComponent} from "../../../_components/dynamic-form-builder/components/form-page/form-page.component";

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
        RouterLink,
        MatSidenavModule,
        QuotationComponent,
        NgIf,
        FormPageComponent
    ],
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  customerId: string = '';
  config: IConfiguration | null = null;
  tabIndex = 0;
  currentUser: User | undefined;
  loading = false;

  constructor(
    private authService: AuthenticationService,
    public formService: FormService,
    private route: ActivatedRoute,
    private apiCustomerService: ApiCustomerService,
    public dialog: MatDialog,
    private utilityService: UtilityService,
    private apiConfigurationService: ApiConfigurationService
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
        // this.apiFormService.getForm()
        this.apiCustomerService.getConfiguration(this.customerId, queryParams.get('configId')!).subscribe(c => {
          this.config = c;
          this.setForm(c);
        });
      }
    });
  }

  setForm(configuration: IConfiguration) {
    this.formService.setForm(configuration.form, this.convertConfigurationToRawJson(configuration.values || []));
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
      this.loading = true;
      this.config.updatedBy = this.currentUser?.name;
      const currentConfigValues = this.generateConfigurationValue(this.formService.form$.getValue(), this.formService.formGroup$.getValue().getRawValue());
      if (this.config.values) {
        const change = this.detectChanges(this.config.values!, currentConfigValues);
        if (change.changes.length > 0) {
          this.apiConfigurationService.createConfigurationChange(this.config.id!, change).subscribe();
        }
      }
      this.config.values = currentConfigValues;
      this.setForm(this.config);
      this.apiCustomerService.updateConfiguration(this.customerId, this.config.id!, this.config).subscribe((_)=> this.loading=false);
    }
  }

  generateConfigurationValue(form: IForm, values: any): IConfigurationItem[] {
    return form.pages.map((item) => {
      const newItem: IConfigurationItem = {page: item.tab ?? '', values: []};

      item.controls.forEach((control) => {
        const dep = this.utilityService.isShow(control);
        const controlOptions = control.options || {};

        if (dep) {
          let shouldAddValue = false;

          if (control.type === 'Columns') {
            const columnValues: IConfigurationItemValue[] = [];

            control.columns?.forEach((column) => {
              column.container.controls.forEach((colControl) => {
                const colDep = this.utilityService.isShow(colControl);
                const colControlOptions = colControl.options || {};

                if (colDep) {
                  const colValue: IConfigurationItemValue = {
                    id: colControl.id,
                    type: colControl.type,
                    title: colControlOptions.title || colControlOptions.label || '',
                    subtitle: colControlOptions.subtitle || '',
                    value: values[colControl.id] || colControl.value || ''
                  };

                  if (this.shouldAddConfigurationItem(colValue)) {
                    shouldAddValue = true;
                    columnValues.push(colValue);
                  }
                }
              });
            });

            if (shouldAddValue) {
              newItem.values.push({
                id: control.id,
                title: controlOptions.label || '',
                type: control.type,
                subtitle: controlOptions.note,
                columns: columnValues
              });
            }
          } else {
            const value: IConfigurationItemValue = {
              id: control.id,
              type: control.type,
              title: controlOptions.title || controlOptions.label || '',
              subtitle: controlOptions.subtitle || controlOptions.note || '',
              value: control.type === 'InfoImage' ? controlOptions.image : values[control.id] || control.value || '',
              fields: control.options?.columns
            };
            if (this.shouldAddConfigurationItem(value)) {
              newItem.values.push(value);
            }
          }
        }
      });

      return newItem;
    }).filter(item => item.values.length > 0);
  }

  shouldAddConfigurationItem(value: IConfigurationItemValue): boolean {
    const isValueNotEmpty = value.value && ((value.value !== '' && value.value.length > 0) || 'id' in value.value);
    const isTypeAllowed = ['InfoBox', 'Divider', 'InfoImage'].includes(value.type);
    return isValueNotEmpty || isTypeAllowed;
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


  openPreviewDialog() {
    if (this.config?.preview === undefined) {
      this.config!.preview = {url3D: ''}
    }
    this.dialog.open(PreviewDialogComponent, {data: this.config?.preview, width: '100vw'});
  }

  detectChanges(originalValues: IConfigurationItem[], updatedValues: IConfigurationItem[]): IConfigChanges {
    const changes: IFieldChange[] = [];

    const detectChangesRecursive = (originalItems: IConfigurationItemValue[], updatedItems: IConfigurationItemValue[], parentField: string = '') => {
      updatedItems.forEach((updatedItem) => {
        const originalItem = originalItems.find(item => item.id === updatedItem.id);

        if (!['InfoImage', 'InfoBox', 'Divider', 'Calculation'].includes(updatedItem.type)) {
          if (!originalItem) {
            changes.push({
              fieldName: `${parentField}${parentField ? '.' : ''}${updatedItem.title}`,
              fieldType: updatedItem.type,
              oldValue: null,
              newValue: updatedItem.value
            });
          } else if (originalItem.value !== updatedItem.value) {
            changes.push({
              fieldName: `${parentField}${parentField ? '.' : ''}${updatedItem.title}`,
              fieldType: updatedItem.type,
              oldValue: originalItem.value,
              newValue: updatedItem.value
            });
          }
          if (updatedItem.type==='Table'){
            if (JSON.stringify(originalItem?.value) !== JSON.stringify(updatedItem.value)){
              console.log("changed")
            } else {
              console.log("orgineel")
            }
            console.log(originalItem!.value)
            console.log(updatedItem.value)
          }
        }

        if (updatedItem.columns && originalItem?.columns) {
          detectChangesRecursive(originalItem.columns, updatedItem.columns, `${parentField}${parentField ? '.' : ''}${updatedItem.title}`);
        }
      });

      originalItems.forEach((originalItem) => {
        const updatedItem = updatedItems.find(item => item.id === originalItem.id);
        if (!updatedItem && !['InfoImage', 'InfoBox', 'Divider', 'Calculation'].includes(originalItem.type)) {
          changes.push({
            fieldName: `${parentField}${parentField ? '.' : ''}${originalItem.title}`,
            fieldType: originalItem.type,
            oldValue: originalItem.value,
            newValue: null
          });
        }
      });
    };

    updatedValues.forEach((updatedItem) => {
      const originalItem = originalValues.find(item => item.page === updatedItem.page);
      if (originalItem) {
        detectChangesRecursive(originalItem.values, updatedItem.values);
      }
    });

    return {createdBy: this.currentUser?.name, changes: changes};
  }


}
