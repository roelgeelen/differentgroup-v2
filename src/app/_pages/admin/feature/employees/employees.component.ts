import {Component} from '@angular/core';
import {SafeUrlPipe} from "../../../../_helpers/pipes/safe-url.pipe";
import {map, Observable} from "rxjs";
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

@Component({
  selector: 'app-configurations-old',
  templateUrl: './employees.component.html',
  standalone: true,
  styleUrls: ['./employees.component.scss','../../../../../assets/styles/table-list.scss'],
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
export class EmployeesComponent {
  allEmployees = false;
  totalElem: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  displayedColumns: string[] = ['picture','name', 'email', 'last_login'];
  table$!: Observable<MatTableDataSource<User>>;
  searchControl = new FormControl<string>('');
  pageSearch: string = '';

  constructor(private employeeService: EmployeeService) {
    this.getUsers()
  }

  getUsers() {
    this.table$ = this.employeeService.getEmployees(this.pageIndex, this.pageSize, this.allEmployees).pipe(
      map(data => {
        this.totalElem = data.page.totalElements;
        return new MatTableDataSource<User>(data.content)
      })
    );
  }

  onPageFired($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getUsers();
  }

}
