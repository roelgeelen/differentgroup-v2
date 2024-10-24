import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {IForm} from "../../../../_components/dynamic-form-builder/models/form.interface";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DatePipe} from "@angular/common";
import {MatMenuModule} from "@angular/material/menu";
import Swal from "sweetalert2";
import {AuthService, User} from "@auth0/auth0-angular";
import {TemplateService} from "../../data-access/template.service";
import {
  MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {debounceTime, map, Observable, switchMap, tap} from "rxjs";
import {MatTooltip} from "@angular/material/tooltip";

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
    MatPaginatorModule,
    MatTooltip
  ],
  styleUrls: [
    './template-list.component.scss',
    '../../../../../assets/styles/table-list.scss'
  ]
})
export class TemplateListComponent implements OnInit {
  currentUser: User | undefined;
  displayedColumns: string[] = ['published', 'title', 'kind', 'updatedAt', 'roles', 'options', 'actions'];
  dataSource: MatTableDataSource<IForm> = new MatTableDataSource<IForm>();
  loading = false;
  searchControl = new FormControl<string>('');
  totalElem: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSearch: string = '';

  constructor(
    private auth: AuthService,
    private templateService: TemplateService,
    private router: Router,
    private route: ActivatedRoute) {
    this.auth.user$.subscribe(user => {
      this.currentUser = user!;
    });
    this.searchControl.valueChanges.pipe(
      map((search) => search?.trim()),
      debounceTime(300),
      switchMap((search) => {
        this.pageIndex = 0;
        this.pageSearch = search??'';
        this.setParams();
        return this.getTemplates(this.pageSearch, this.pageIndex, this.pageSize)
      })
    ).subscribe()
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.pageIndex = +(params.get('page') ?? '');
      this.pageSize = +(params.get('size') ?? '10');
      this.pageSearch = params.get('query') ?? '';
      this.searchControl.setValue(this.pageSearch, {emitEvent: false} );
      //
    });
    this.getTemplates(this.pageSearch, this.pageIndex, this.pageSize).subscribe();
  }

  getTemplates(name: string, page: number, size: number): Observable<any> {
    // this.loading = true;
    return this.templateService.getTemplates(name, page, size).pipe(
      tap({
        next: (c) => {
          this.dataSource.data = c.content;
          this.totalElem = c.page.totalElements;
        }
      })
    );
  }

  onPageFired($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getTemplates(this.pageSearch, this.pageIndex, this.pageSize).subscribe();
    this.setParams();
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


  setParams() {
    const queryParams = {
      page: this.pageIndex,
      size: this.pageSize,
      query: this.pageSearch
    };
    // Use router navigation to update query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
