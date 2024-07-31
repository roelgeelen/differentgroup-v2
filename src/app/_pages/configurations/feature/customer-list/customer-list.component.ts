import {Component, OnInit, ViewChild} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatRippleModule} from "@angular/material/core";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ICustomer, IRecentCustomer} from "../../utils/customer.interface";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {AuthService, User} from "@auth0/auth0-angular";
import {IConfiguration} from "../../utils/configuration.interface";
import {MatMenuModule} from "@angular/material/menu";
import {FormPageComponent} from "../../../../_components/dynamic-form-builder/components/form-page/form-page.component";
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
import {CustomerService} from "../../data-access/customer.service";

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
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
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
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
    private auth: AuthService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.auth.user$.subscribe(user => {
      this.currentUser = user!;
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.pageIndex = +(params.get('page') ?? '');
      this.pageSize = +(params.get('size') ?? '10');
      this.pageSearch = params.get('query') ?? '';
      this.searchControl.setValue(this.pageSearch);
      this.getRecentCustomers(this.pageSearch, this.pageIndex, this.pageSize);
    });
  }

  getRecentCustomers(name: string, page: number, size: number) {
    this.loading = true;
    this.customerService.findRecentCustomers({name: name, page: page, size: size}).subscribe({
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
    this.setParams();
  }

  onPageFired($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getRecentCustomers(this.pageSearch, this.pageIndex, this.pageSize);
    this.setParams();
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
