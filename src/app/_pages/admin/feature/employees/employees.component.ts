import {Component, OnInit} from '@angular/core';
import {SafeUrlPipe} from "../../../../_helpers/pipes/safe-url.pipe";
import {debounceTime, delay, map, Observable, of, switchMap, tap} from "rxjs";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {EmployeeService} from "../../data-access/employee.service";
import {AsyncPipe, DatePipe} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {RouterLink} from "@angular/router";
import {User} from "@auth0/auth0-angular";
import {AvatarComponent} from "../../../../_helpers/components/avatar/avatar.component";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-configurations-old',
  templateUrl: './employees.component.html',
  standalone: true,
  styleUrls: ['./employees.component.scss', '../../../../../assets/styles/table-list.scss'],
  imports: [
    SafeUrlPipe,
    AsyncPipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatPaginator,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatTable,
    RouterLink,
    MatMenuTrigger,
    MatHeaderCellDef,
    MatNoDataRow,
    AvatarComponent,
    DatePipe,
    MatFormField,
    MatInput,
    MatLabel,
    MatPrefix,
    MatSuffix,
    ReactiveFormsModule
  ]
})
export class EmployeesComponent implements OnInit {
  allEmployees = false;
  totalElem: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  displayedColumns: string[] = ['picture', 'name', 'email', 'last_login'];
  table!: null | MatTableDataSource<User>;
  searchControl = new FormControl<string>('');
  pageSearch: string = '';
  loading = false;

  constructor(private employeeService: EmployeeService) {
    // this.getUsers()
    this.searchControl.valueChanges.pipe(
      map((search) => search?.trim()),
      debounceTime(300),
      switchMap((search) => {
        this.pageIndex = 0;
        this.pageSearch = (search!.length>2?search:'') ?? '';
        return this.getUsers$();
        // return this.getTemplates(this.pageSearch, this.pageIndex, this.pageSize)
      })
    ).subscribe((datasource)=> {
      this.table = datasource;
    })
  }

  ngOnInit() {
    this.getUsers()
  }

  getUsers() {
    this.getUsers$().subscribe((datasource)=> {
      this.table = datasource;
    })
  }

  getUsers$() {
    this.table = null;
    this.loading = true; // Zet loading op true voordat het ophalen begint
    return this.employeeService.getEmployees(this.pageIndex, this.pageSize, this.allEmployees, this.pageSearch).pipe(
      map(data => {
        this.totalElem = data.page.totalElements;
        return new MatTableDataSource<User>(data.content);
      }),
      tap(() => this.loading = false),  // Zet loading op false wanneer het succesvol is geladen
      catchError(error => {
        this.loading = false;           // Zet loading op false bij een fout
        console.error(error);           // Log de fout
        return of(null);                // Retourneer een lege waarde of een andere fallback
      })
    );
  }

  onPageFired($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getUsers();
  }

}
