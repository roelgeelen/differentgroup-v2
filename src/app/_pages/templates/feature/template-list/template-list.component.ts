import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {IForm} from "../../../../_components/dynamic-form-builder/models/form.interface";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DatePipe} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import Swal from "sweetalert2";
import {AuthenticationService} from "../../../../_auth/authentication.service";
import {User} from "../../../../_auth/models/User";
import {TemplateService} from "../../data-access/template.service";
import {
  MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {debounceTime, map, Observable, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DatePipe,
    MatTableModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatMenuModule,
    MatPaginatorModule
  ],
  styleUrl: './template-list.component.scss'
})
export class TemplateListComponent implements OnInit {
  currentUser: User | undefined;
  displayedColumns: string[] = ['published', 'title', 'kind', 'updatedAt', 'icons','options'];
  dataSource: MatTableDataSource<IForm> = new MatTableDataSource<IForm>();
  loading = false;
  searchControl = new FormControl<string>('');
  totalElem: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSearch: string = '';

  constructor(private authService: AuthenticationService, private templateService: TemplateService, private router: Router) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
    this.searchControl.valueChanges.pipe(
      map((search) => search?.trim()),
      debounceTime(300),
      switchMap((search) => {
        this.pageIndex = 0;
        return this.getTemplates(search ?? '', this.pageIndex, this.pageSize)
      })
    ).subscribe()
  }

  ngOnInit(): void {
    this.getTemplates(this.pageSearch, this.pageIndex, this.pageSize).subscribe();
  }

  getTemplates(name: string, page: number, size: number): Observable<any> {
    // this.loading = true;
    return this.templateService.getTemplates(name, page, size).pipe(
      tap({
        next: (c) => {
          this.dataSource.data = c.content;
          this.totalElem = c.totalElements;
        }
      })
    );
  }

  onPageFired($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getTemplates(this.pageSearch, this.pageIndex, this.pageSize).subscribe();
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
        this.templateService.getTemplate(`${form.id}`).subscribe(f => {
          const newForm: IForm = {
            title: result.value,
            kind: f.kind,
            pages: f.pages,
            options: f.options,
            updatedBy: this.currentUser?.name
          }

          this.templateService.saveTemplate(newForm).subscribe(
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
        this.templateService.deleteTemplate(`${form.id}`).subscribe({
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
            this.getTemplates(this.pageSearch, this.pageIndex, this.pageSize).subscribe();
            this.loading = false;
          },
        })
      }
    });
  }

}
