import {Component} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatRippleModule} from "@angular/material/core";
import {ApiCustomerService} from "../../../_services/api-customer.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ICustomer} from "../../../_models/configuration/customer.interface";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {IForm} from "../../../_components/dynamic-form-builder/models/form.interface";
import {ApiFormService} from "../../../_services/api-form.service";
import {User} from "../../../_auth/models/User";
import {AuthenticationService} from "../../../_auth/authentication.service";
import {IConfiguration} from "../../../_models/configuration/configuration.interface";
import Swal from "sweetalert2";
import {MatMenuModule} from "@angular/material/menu";
import {FormPageComponent} from "../../../_components/dynamic-form-builder/components/form-page/form-page.component";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
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
    FormPageComponent
  ],
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  customer: ICustomer | null = null;
  newForm: IForm | null = null;
  templates: IForm[] = [];
  currentUser: User | undefined;
  configurations: IConfiguration[] | null = null
  paramId: string = '';
  loading = false;

  constructor(
    private authService: AuthenticationService,
    private apiCustomerService: ApiCustomerService,
    private apiFormService: ApiFormService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap.subscribe(queryParams => {
      if (queryParams.get('dealId') !== null) {
        this.paramId = queryParams.get('dealId')!;
        this.findCustomer(queryParams.get('dealId')!)
      }
    });
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }

  findFormTemplates() {
    this.apiFormService.getForms().subscribe(f => this.templates = f);
  }

  getConfigurations() {
    this.apiCustomerService.getConfigurations(this.customer!.dealId!).subscribe(c => {
      this.configurations = c
    });
  }

  findCustomer(id: string) {
    this.loading = true;
    this.apiCustomerService.findCustomer(id).subscribe({
      next: (c) => {
        this.customer = c;
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
    const newConfig: IConfiguration = {
      customer: this.customer!,
      form: form,
      title: form.title,
      updatedBy: this.currentUser?.name
    }
    form.updatedBy = this.currentUser?.name;
    this.apiCustomerService.createConfiguration(this.customer!.dealId!, newConfig).subscribe({
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
        this.apiCustomerService.deleteConfiguration(this.customer!.dealId!, config.id!).subscribe({
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
}
