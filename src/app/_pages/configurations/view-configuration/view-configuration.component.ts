import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {ActivatedRoute, NavigationExtras, Router, RouterLink} from "@angular/router";
import {
  IConfiguration, IConfigurationItem,
} from "../../../_models/configuration/configuration.interface";
import {ApiCustomerService} from "../../../_services/api-customer.service";
import {SharedModule} from "../../../shared.module";
import {IFormControl} from "../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MatSidenavModule} from "@angular/material/sidenav";
import {QuotationComponent} from "../dynamic-form/quotation/quotation.component";
import {ConfigurationHistoryComponent} from "./configuration-history/configuration-history.component";
import {KeyValuePipe, NgIf} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatMenuModule} from "@angular/material/menu";
import {
  IFormControlOptionsVisibility
} from "../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {ITheme, ThemeService} from "../../../_helpers/theme.service";

@Component({
  selector: 'app-view-configuration',
  templateUrl: './view-configuration.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    RouterLink,
    SharedModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    QuotationComponent,
    ConfigurationHistoryComponent,
    KeyValuePipe,
    NgIf,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule
  ],
  styleUrl: './view-configuration.component.scss'
})
export class ViewConfigurationComponent implements OnInit {
  theme: ITheme | null = null;
  configuration: IConfiguration | null = null;
  visibleFor: { key: string, label: string } = {key: 'intern', label: 'Intern'};
  safe3dUrl: SafeResourceUrl = '';
  values: IConfigurationItem[] = [];

  viewOptions = [
    {key: 'intern', label: 'Intern'},
    {key: 'extern', label: 'Extern'},
    {key: 'customer', label: 'Klant'},
  ]

  constructor(
    private themeService: ThemeService,
    private apiCustomerService: ApiCustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
  }
  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => this.theme = t);
    this.route.paramMap.subscribe(params => {
      if (params.get('configId') !== null) {
        this.apiCustomerService.getConfiguration(params.get('dealId')!, params.get('configId')!).subscribe(c => {
          this.configuration = c;
          if (this.configuration?.preview?.url3D) {
            this.getSafeUrl(this.configuration?.preview?.url3D)
          }
          this.removeInvisibleItems()
        });
      }
    });
    this.route.queryParams.subscribe(params => {
      const typeParam = params['type'];
      if (typeParam) {
        if (typeParam === 'intern' || typeParam === 'extern' || typeParam === 'customer') {
          this.visibleFor = this.viewOptions.find(option => option.key === typeParam)!;
        }
      }
    });
  }

  mapFormControls() {
    const controls: IFormControl[] = [];
    this.configuration?.form.pages.forEach((page) => {
      page.controls.forEach((control) => {
        if ('columns' in control) {
          control.columns?.forEach((colValue) => {
            if (colValue.container && colValue.container.controls) {
              controls.push(...colValue.container.controls);
            }
          });
        }
        controls.push(control);
      });
    });
    return controls;
  }

  parentFormControl(controls: IFormControl[], id: string) {
    return controls.find(control => control.id === id);
  }

  removeInvisibleItems() {
    const controls = this.mapFormControls();
    this.values = this.configuration?.values ? JSON.parse(JSON.stringify(this.configuration.values)) : [];
    this.values.forEach((page) => {
      page.values = page.values.filter((value) => {
        const parent = this.parentFormControl(controls, value.id!);
        if (!parent) {
          return true;
        }
        const visibility = parent.options?.visibility?.[this.visibleFor.key as keyof IFormControlOptionsVisibility];
        return visibility !== undefined ? visibility : true;
      });
    });
  }

  getSafeUrl(url: string) {
    this.safe3dUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  changeVisibleFor(value: { key: string, label: string }) {
    this.visibleFor = value;
    this.removeInvisibleItems()
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {type: this.visibleFor.key},
      queryParamsHandling: 'merge',
      replaceUrl: false,
    };

    this.router.navigate([], navigationExtras);
  }
}
