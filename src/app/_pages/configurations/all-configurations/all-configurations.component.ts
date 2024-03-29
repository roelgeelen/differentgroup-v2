import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatRippleModule} from "@angular/material/core";
import {ApiCustomerService} from "../../../_services/api-customer.service";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ICustomer, IRecentCustomer} from "../../../_models/configuration/customer.interface";
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
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef,
  MatTable, MatTableDataSource
} from "@angular/material/table";

@Component({
  selector: 'app-overview',
  templateUrl: './all-configurations.component.html',
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
    MatPaginator,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow
  ],
  styleUrl: './all-configurations.component.scss'
})
export class AllConfigurationsComponent implements OnInit{
  searchControl = new FormControl<string>('');
  customer: ICustomer | null = null;
  currentUser: User | undefined;
  configurations: IConfiguration[] | null = null
  loading = false;

  displayedColumns: string[] = ['dealId', 'name', 'updatedBy', 'updatedAt', 'count'];
  dataSource: MatTableDataSource<IRecentCustomer> = new MatTableDataSource<IRecentCustomer>();

  totalElem: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSearch: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private authService: AuthenticationService,
    private apiCustomerService: ApiCustomerService,
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }

  ngOnInit(): void {
    this.getRecentCustomers(this.pageSearch, this.pageIndex, this.pageSize);
  }
  getRecentCustomers(name: string, page: number, size: number) {
    this.loading = true;
    this.apiCustomerService.findRecentCustomers({name:name, page:page, size:size}).subscribe({
      next: (c) => {
        this.dataSource.data = c.content
        this.totalElem = c.totalElements
      },
      error: (_) => {
        this.loading = false
      },
      complete: () => this.loading = false
    })
  }

  submitSearch() {
    this.pageIndex = 0;
    if (this.searchControl.value !== null) {
      this.pageSearch = this.searchControl.value;
    }
    this.getRecentCustomers(this.pageSearch, this.pageIndex, this.pageSize);
  }

  onPageFired($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getRecentCustomers(this.pageSearch, this.pageIndex, this.pageSize);
  }
}
