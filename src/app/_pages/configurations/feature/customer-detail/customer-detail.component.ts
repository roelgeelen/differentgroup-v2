import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatRippleModule} from "@angular/material/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ICustomer} from "../../utils/customer.interface";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DatePipe, DecimalPipe, KeyValuePipe} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {IForm} from "../../../../_components/dynamic-form-builder/models/form.interface";
import {AuthService, User} from "@auth0/auth0-angular";
import {IConfiguration} from "../../utils/configuration.interface";
import Swal from "sweetalert2";
import {MatMenuModule} from "@angular/material/menu";
import {FormPageComponent} from "../../../../_components/dynamic-form-builder/components/form-page/form-page.component";
import {ITheme, ThemeService} from "../../../../_helpers/theme.service";
import {Subscription} from "rxjs";
import {EnumRoles} from "../../../../_auth/models/enumRoles";
import {CustomerService} from "../../data-access/customer.service";
import {ConfigurationService} from "../../data-access/configuration.service";
import {MatTooltip} from "@angular/material/tooltip";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatRippleModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    DatePipe,
    RouterLink,
    MatMenuModule,
    FormPageComponent,
    DecimalPipe,
    KeyValuePipe,
    MatTooltip
  ],
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent implements OnInit, OnDestroy{
  showAppLink = false;
  themeSubscription?: Subscription;
  customer: ICustomer | null = null;
  newForm: IForm | null = null;
  templates: { [kind: string]: IForm[] } = {};
  currentUser: User | undefined;
  configurations: IConfiguration[] | null = null
  paramId: string = '';
  loading = false;
  selectedTheme?: ITheme;

  constructor(
    private auth: AuthService,
    private customerService: CustomerService,
    private configurationService:ConfigurationService,
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private titleService: Title
  ) {
    this.route.paramMap.subscribe(queryParams => {
      if (queryParams.get('dealId') !== null) {
        this.paramId = queryParams.get('dealId')!;
        this.findCustomer(queryParams.get('dealId')!)
      }
    });
    this.auth.user$.subscribe(user => {
      this.currentUser = user!;
    });
    this.themeSubscription = this.themeService.theme$.subscribe(t => this.selectedTheme = t)
  }

  ngOnInit() {
    this.detectMobileDevice();
  }

  ngOnDestroy() {

    if (this.themeSubscription){
      this.themeSubscription.unsubscribe();
    }
  }

  detectMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor;

    if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
      this.showAppLink = true;
    }
  }

  get isFORMULIEREN() {
    //TODO
    return true;
    // return this.currentUser && this.currentUser.roles.indexOf(EnumRoles.FORMULIEREN) !== -1;
  }

  findFormTemplates() {
    this.configurationService.getTemplates().subscribe(f =>{
      this.templates = f.content.reduce(
        (result: any, currentValue: any) => {
          (result[currentValue['kind']] = result[currentValue['kind']] || []).push(currentValue);
          return result;
        }, {});
    });
  }

  getConfigurations() {
    this.configurationService.getConfigurations(this.customer!.dealId!).subscribe(c => {
      this.configurations = c
    });
  }

  findCustomer(id: string) {
    this.loading = true;
    this.customerService.findCustomer(id).subscribe({
      next: (c) => {
        this.customer = c;
        this.titleService.setTitle(this.customer.name);
        this.findFormTemplates();
        this.getConfigurations();
      },
      error: (_) => {
        this.router.navigate(['/customers'], {
          queryParams: {'notfound': 'true'},
        })
        this.loading = false
      },
      complete: () => this.loading = false
    })
  }

  addConfiguration(form: IForm) {
    this.loading = true;
    console.log(form)
    const newConfig: IConfiguration = {
      customer: this.customer!,
      form: form,
      title: form.title,
      updatedBy: this.currentUser?.name,
      published: form.options?.published??false
    }
    form.updatedBy = this.currentUser?.name;
    this.configurationService.createConfiguration(this.customer!.dealId!, newConfig).subscribe({
      next: (c) => {
        this.router.navigate([`/customers/${this.customer?.dealId}/configurations/${c.id}/edit`])
      },
      error: (_) => {
        this.loading = false
      },
      complete: () => this.loading = false
    });
  }

  deleteConfig(config: IConfiguration, index: number) {
    Swal.fire({
      title: 'Weet je het zeker?',
      text: `Wil je "${config.title}" verwijderen?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e3785',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ja, verwijderen!',
      cancelButtonText: 'Annuleren',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.configurationService.deleteConfiguration(this.customer!.dealId!, config.id!).subscribe({
          error: (_) => {
            this.loading = false
          },
          complete: () => {
            this.configurations!.splice(index, 1);
            this.loading = false
          }
        })
      }
    });
  }

  duplicateForm(config: IConfiguration) {
    Swal.fire({
      title: 'Formulier dupliceren',
      input: 'text',
      inputValue: config.title + ' copy',
      showCancelButton: true,
      confirmButtonText: 'Dupliceren',
      showLoaderOnConfirm: true,
      cancelButtonText: 'Annuleren',
      confirmButtonColor: '#2e3785',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.configurationService.getConfiguration(this.customer!.dealId!, config.id!).subscribe(c => {
          const newConfig: IConfiguration = {
            customer: this.customer!,
            form: c.form,
            title: result.value,
            updatedBy: this.currentUser?.name,
            values: c.values,
            preview: c.preview,
            published: false
          }
          this.configurationService.createConfiguration(this.customer!.dealId!, newConfig).subscribe({
            next: (conf) => {
              this.router.navigate([`/customers/${this.customer?.dealId}/configurations/${conf.id}/edit`])
            },
            error: (_) => {
              this.loading = false
            },
            complete: () => this.loading = false
          });
        });
      }
    })
  }

  moveForm(config: IConfiguration) {
    Swal.fire({
      title: 'Formulier verplaatsen',
      input: 'number',
      inputPlaceholder:'Hubspot ID',
      inputValue: config.title + ' copy',
      showCancelButton: true,
      confirmButtonText: 'Verplaatsen',
      showLoaderOnConfirm: true,
      cancelButtonText: 'Annuleren',
      confirmButtonColor: '#2e3785',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.configurationService.moveConfiguration(this.customer!.dealId!, config.id!, result.value).subscribe(
          {
            next: (conf) => {
              this.getConfigurations();
              Swal.fire({
                title: 'Gelukt!',
                text: 'De configuratie is overgeplaatst',
                icon: 'success',
                confirmButtonColor: '#2e3785',
                confirmButtonText: 'sluiten'
              })
            },
            error: (_) => {
              Swal.fire({
                title: 'Error',
                text: 'Er is iets fout gegaan, probeer het later nog eens',
                icon: 'error',
                confirmButtonColor: '#2e3785',
                confirmButtonText: 'sluiten'
              });
              this.loading = false
            },
            complete: () => this.loading = false
          }
        )
      }
    })

  }
}
