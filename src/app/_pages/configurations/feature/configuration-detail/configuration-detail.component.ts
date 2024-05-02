import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ActivatedRoute, NavigationExtras, Router, RouterLink} from "@angular/router";
import {
  IConfiguration,
} from "../../utils/configuration.interface";
import {SharedModule} from "../../../../shared.module";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MatSidenavModule} from "@angular/material/sidenav";
import {ConfigurationHistoryComponent} from "./configuration-history/configuration-history.component";
import {DatePipe, KeyValuePipe, NgIf} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatMenuModule} from "@angular/material/menu";
import {FormPageComponent} from "../../../../_components/dynamic-form-builder/components/form-page/form-page.component";
import {EnumRoles} from "../../../../_auth/models/enumRoles";
import {AuthenticationService} from "../../../../_auth/authentication.service";
import {User} from "../../../../_auth/models/User";
import {CustomerService} from "../../data-access/customer.service";
import {ConfigurationService} from "../../data-access/configuration.service";

@Component({
  selector: 'app-configuration-detail',
  templateUrl: './configuration-detail.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    SharedModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    ConfigurationHistoryComponent,
    KeyValuePipe,
    NgIf,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    FormPageComponent,
    DatePipe
  ],
  styleUrl: './configuration-detail.component.scss'
})
export class ConfigurationDetailComponent implements OnInit {
  currentUser: User | undefined;
  dealId: string = '';
  configId: string = '';
  configuration: IConfiguration | null = null;
  visibleFor: { key: string, label: string } = {key: 'intern', label: 'Intern'};
  safe3dUrl: SafeResourceUrl = '';
  loading = false;

  viewOptions = [
    {key: 'intern', label: 'Intern'},
    {key: 'extern', label: 'Extern'},
    {key: 'customer', label: 'Klant'},
  ]

  constructor(
    private configurationService: ConfigurationService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private authService: AuthenticationService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('configId') !== null) {
        this.dealId = params.get('dealId')!;
        this.configId = params.get('configId')!;
        this.route.queryParams.subscribe(params => {
          const typeParam = params['type'];
          if (typeParam) {
            if (typeParam === 'intern' || typeParam === 'extern' || typeParam === 'customer') {
              this.visibleFor = this.viewOptions.find(option => option.key === typeParam)!;
              this.getConfiguration(this.dealId, this.configId, this.visibleFor.key);
            }
          }
        });
      }
    });
  }

  get isFORMULIEREN() {
    return this.currentUser && this.currentUser.roles.indexOf(EnumRoles.FORMULIEREN) !== -1;
  }

  getConfiguration(dealId: string, configId: string, type: string) {
    this.configuration = null;
    this.loading = true;
    this.configurationService.getConfiguration(dealId, configId, type).subscribe(c => {
      this.configuration = c;
      if (this.configuration?.preview?.url3D) {
        this.getSafeUrl(this.configuration?.preview?.url3D)
      }
      this.loading = false;
    });
  }

  getSafeUrl(url: string) {
    this.safe3dUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  changeVisibleFor(value: { key: string, label: string }) {
    this.visibleFor = value;
    this.getConfiguration(this.dealId, this.configId, this.visibleFor.key);
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {type: this.visibleFor.key},
      queryParamsHandling: 'merge',
      replaceUrl: false,
    };

    this.router.navigate([], navigationExtras);
  }
}
