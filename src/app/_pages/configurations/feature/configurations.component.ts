import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatRippleModule} from "@angular/material/core";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {IRecentCustomer} from "../utils/customer.interface";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AsyncPipe, DatePipe} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSelectModule} from "@angular/material/select";
import {User} from "../../../_auth/models/User";
import {AuthenticationService} from "../../../_auth/authentication.service";
import {MatMenuModule} from "@angular/material/menu";
import {FormPageComponent} from "../../../_components/dynamic-form-builder/components/form-page/form-page.component";
import {Observable} from "rxjs";
import {IPage} from "../../../_models/page.interface";
import {CustomerService} from "../data-access/customer.service";

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
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
    AsyncPipe,
  ],
  styleUrl: './configurations.component.scss'
})
export class ConfigurationsComponent implements OnInit {
  currentUser: User | undefined;
  searchControl = new FormControl<string>('', Validators.required);
  recentCustomers$?: Observable<IPage<IRecentCustomer[]>>;
  error: string = '';

  constructor(
    private authService: AuthenticationService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['notfound'] === 'true') {
        this.error = 'Kon deal nummer niet vinden.';
        this.router.navigate([], {
          queryParams: {},
          replaceUrl: true,
        });
      }
    });
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }

  ngOnInit(): void {
    this.recentCustomers$ = this.customerService.findRecentCustomers({username: this.currentUser!.name, page: 0, size: 5});
  }

  submitSearch() {
    if (this.searchControl.value !== null) {
      this.findCustomer(this.searchControl.value);
    }
  }

  findCustomer(id: string) {
    this.error = '';
    if (!id) {
      this.error = 'Vul eerst een deal nummer in';
      return;
    }
    this.router.navigate(['/customers/' + id]);
  }
}
