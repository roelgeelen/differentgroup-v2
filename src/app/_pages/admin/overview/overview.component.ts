import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {ApiFormService} from "../../../_services/api-form.service";
import {IForm} from "../../../_components/dynamic-form-builder/models/form.interface";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DatePipe, Location} from "@angular/common";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {IConfiguration} from "../../../_models/configuration/configuration.interface";
import Swal from "sweetalert2";
import {AuthenticationService} from "../../../_auth/authentication.service";
import {User} from "../../../_auth/models/User";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DatePipe,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  currentUser: User | undefined;
  forms: IForm[] | null = null;
  loading = false;

  constructor(private apiFormService: ApiFormService, private authService: AuthenticationService, private router: Router) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }

  ngOnInit(): void {
    this.getForms();
  }

  getForms() {
    this.loading = true;
    this.apiFormService.getForms(false).subscribe(r => {
      this.forms = r;
      this.loading = false;
    });
  }

  duplicateForm(form: IForm) {
    Swal.fire({
      title: 'Formulier dupliceren',
      input: 'text',
      inputValue: form.title + ' copy',
      showCancelButton: true,
      confirmButtonText: 'Dupliceren',
      showLoaderOnConfirm: true,
      cancelButtonText: 'Annuleren',
      confirmButtonColor: '#2e3785',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.apiFormService.getForm(`${form.id}`).subscribe(f => {
          const newForm: IForm = {
            title: result.value,
            kind: f.kind,
            pages: f.pages,
            options: f.options,
            updatedBy: this.currentUser?.name
          }

          this.apiFormService.saveForm(newForm).subscribe(
            {
              next: (nf) => {
                this.router.navigate([`/admin/forms/${nf.id}/builder`]);
              },
              error: (_) => {
                this.loading = false
              },
              complete: () => this.loading = false
            }
          )
        });
      }
    })
  }

  deleteForm(form: IForm) {
    Swal.fire({
      title: 'Weet je het zeker?',
      text: 'Wil je dit formulier verwijderen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e3785',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ja, verwijderen!',
      cancelButtonText: 'Annuleren',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.apiFormService.deleteForm(`${form.id}`).subscribe({
          error: (_) => {
            Swal.fire({
              title: 'Error',
              text: 'Er is iets fout gegaan, mogelijk wordt dit formulier al gebruikt',
              icon: 'error',
              confirmButtonColor: '#2e3785',
              confirmButtonText: 'sluiten'
            });
            this.loading = false;
          },
          complete: () => {
            this.getForms();
            this.loading = false;
          },
        })
      }
    });
  }
}
