import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormService} from "../../../_components/dynamic-form-builder/services/form.service";
import {AsyncPipe, NgIf, NgTemplateOutlet} from "@angular/common";
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
import {MatDrawer, MatSidenavModule} from "@angular/material/sidenav";
import {QuotationComponent} from "./quotation/quotation.component";
import {PreviewDialogComponent} from "./preview-dialog/preview-dialog.component";
import {ApiConfigurationService} from "../../../_services/api-configuration.service";
import {FormPageComponent} from "../../../_components/dynamic-form-builder/components/form-page/form-page.component";
import Swal from "sweetalert2";
import {QuoteService} from "./quotation/quote.service";
import {firstValueFrom, Subscription} from "rxjs";
import {IFormPage} from "../../../_components/dynamic-form-builder/models/form-container.interface";
import {IColumn} from "../../../_components/dynamic-form-builder/form-controls/columns/column.interface";
import {CanDeactivateType} from "../../../_helpers/guards/can-deactivate.guard";
import {MatSlideToggle} from "@angular/material/slide-toggle";

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
    FormPageComponent,
    NgTemplateOutlet,
    MatSlideToggle
  ],
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') public drawer?: MatDrawer;
  customerId: string = '';
  config: IConfiguration | null = null;
  tabIndex = 0;
  currentUser: User | undefined;
  saving = false;
  loading = false;
  dealFieldsToUpdate: { [key: string]: any } = {};
  private formServiceSubscription: Subscription | undefined;
  isSaved = true;
  totalPrice = 0;

  constructor(
    private authService: AuthenticationService,
    public formService: FormService,
    private route: ActivatedRoute,
    private apiCustomerService: ApiCustomerService,
    public dialog: MatDialog,
    private utilityService: UtilityService,
    private apiConfigurationService: ApiConfigurationService,
    private quoteService: QuoteService,
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
          this.setForm(c);
          this.drawer?.open();
        });
      }
    });
    this.formServiceSubscription = this.formService.controlValueChanged$.subscribe(control => {
      this.isSaved = false;
      this.updateFormValues()
      if (control?.options?.toDeal) {
        this.dealFieldsToUpdate[control.options.toDeal] = this.formService.formGroup$.getValue().getRawValue()[control.id!];
      }
    })
  }

  ngOnDestroy(): void {
    if (this.formServiceSubscription) {
      this.formServiceSubscription.unsubscribe();
    }
  }

  setTotalPrice(price: number){
    this.totalPrice = price;
  }

  canDeactivate(): CanDeactivateType {
    if (!this.isSaved) {
      return Swal.fire({
        title: "Pagina verlaten?",
        text: "Je hebt nog niet alles opgeslagen.",
        icon: "warning",
        showDenyButton: true,
        confirmButtonColor: '#2e3785',
        cancelButtonColor: '#d33',
        confirmButtonText: "Ja, verlaten",
        denyButtonText: `Annuleren`
      }).then((result) => {
        return result.isConfirmed;
      });
    } else {
      return true;
    }
  }

  private updateFormValues() {
    const form = this.formService.formGroup$.value.getRawValue();
    this.formService.form$.value.pages.forEach(page => {
      if (this.showPage(page)) {
        page.controls.forEach(control => {
          if (form[control.id] !== null || form[control.id] !== undefined) {
            if (control.options?.dependent && !this.utilityService.isShow(control.options?.dependent)) {
              this.formService.formGroup$.value.get(control.id)?.reset({}, {emitEvent: false});
            }
          }
          if (control.type === 'Columns' && Array.isArray(control.columns)) {
            control.columns.forEach((col: IColumn) => {
              col.container.controls.forEach((c) => {
                if (form[control.id] !== null || form[control.id] !== undefined) {
                  if (control.options?.dependent && this.utilityService.isShow(control.options?.dependent)) {
                    this.formService.formGroup$.value.get(control.id)?.reset({}, {emitEvent: false});
                  }
                }
              })
            })
          }
        })
      } else {
        page.controls.forEach(control => {
          if ('columns' in control) {
            control.columns!.forEach(col => col.container.controls.forEach(c => this.formService.formGroup$.value.get(c.id)?.reset()));
          } else {
            this.formService.formGroup$.value.get(control.id)?.reset({}, {emitEvent: false});
          }
        });
      }
    })
  }

  async setForm(configuration: IConfiguration) {
    this.isSaved = true;
    let values = this.convertConfigurationToRawJson(configuration.values || []);
    this.formService.setForm(configuration.form, values);
    if (Object.keys(values).length === 0) {
      this.formService.formGroup$.getValue().patchValue(await this.replaceHubspotFieldValues())
    }
  }

  async replaceHubspotFieldValues(): Promise<{ [key: string]: string }> {
    const fields = this.formService.getHubspotFields();
    try {
      const deal = await firstValueFrom(
        this.apiConfigurationService.getDeal(this.config?.id!, Object.values(fields)).pipe()
      ) || {properties: {}};
      return this.replaceValuesBasedOnKeys(deal, fields);
    } catch (error) {
      console.error("Error fetching deal:", error);
      return {};
    }
  }

  replaceValuesBasedOnKeys(deal: { id: string, properties: any }, fields: { [key: string]: string }): {
    [key: string]: string
  } {
    const result: { [key: string]: string } = {};

    for (const hubspotFieldKey in fields) {
      if (fields.hasOwnProperty(hubspotFieldKey)) {
        const propertyKey = fields[hubspotFieldKey];
        result[hubspotFieldKey] = deal.properties[propertyKey];
      }
    }

    return result;
  }

  getFormValidationErrors(): string[] {
    let formError: string[] = [];
    const formGroup = this.formService.formGroup$.value;
    Object.keys(formGroup.controls).forEach(key => {
      // @ts-ignore
      const controlErrors: ValidationErrors = formGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          formError.push(key)
        });
      }
    });
    return formError;
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

  public showPage(page: IFormPage) {
    return (this.utilityService.isShow(page.dependent ?? []))
  }

  submit() {
    Swal.fire({
      title: 'Wil je de artikelen toevoegen aan de huidige offerte?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Ja, toevoegen',
      confirmButtonColor: '#2e3785',
      denyButtonText: `Nee, vervangen`,
      cancelButtonText: 'Annuleren'
    }).then((result) => {
      if (!result.isDismissed) {
        this.loading = true;
        this.apiConfigurationService.createInvoice(this.config?.id!, !result.isConfirmed, this.quoteService.getQuoteItems(this.formService.form$.getValue(), this.formService.formGroup$.getValue().getRawValue())).subscribe({
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'Er is iets fout gegaan, probeer het later nog eens',
              icon: 'error',
              confirmButtonColor: '#2e3785',
              confirmButtonText: 'sluiten'
            });
            this.loading = false;
          },
          complete: () => {
            this.apiCustomerService.updateConfigAmount(this.customerId, this.config?.id!, this.totalPrice).subscribe()
            Swal.fire({
              title: 'Gelukt!',
              html: ``,
              icon: 'success',
              confirmButtonColor: '#2e3785',
              confirmButtonText: 'sluiten'
            })
            this.loading = false
          }
        });
      }
    });
  }

  saveForm() {
    if (this.config) {
      this.saving = true;
      this.config.updatedBy = this.currentUser?.name;
      this.config.values = this.generateConfigurationValue(this.formService.form$.getValue(), this.formService.formGroup$.getValue().getRawValue());
      this.setForm(this.config).then();
      this.apiCustomerService.updateConfiguration(this.customerId, this.config.id!, this.config).subscribe({
        error: () => this.saving = false,
        complete: () => this.saving = false
      });

      if (Object.keys(this.dealFieldsToUpdate).length !== 0) {
        this.apiConfigurationService.updateToDeal(this.config.id!, this.dealFieldsToUpdate).subscribe(s => this.dealFieldsToUpdate = {});
      }
    }
  }

  generateConfigurationValue(form: IForm, values: any): IConfigurationItem[] {
    return form.pages.map((item) => {
      const newItem: IConfigurationItem = {page: item.tab ?? '', values: []};

      item.controls.forEach((control) => {
        const dep = this.utilityService.isShow(control.options?.dependent ?? []);
        const controlOptions = control.options || {};

        if (dep) {
          let shouldAddValue = false;

          if (control.type === 'Columns') {
            const columnValues: IConfigurationItemValue[] = [];

            control.columns?.forEach((column) => {
              column.container.controls.forEach((colControl) => {
                const colDep = this.utilityService.isShow(colControl.options?.dependent ?? []);
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
    this.dialog.open(PreviewDialogComponent, {data: this.config?.preview});
  }

  getFieldTitle(error: string) {
    const field = this.formService.findControlById(error);
    return field?.options?.label || field?.options?.title;
  }
}
