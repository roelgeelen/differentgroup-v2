import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {FlexModule} from "@angular/flex-layout";
import {NewControlsComponent} from "./new-controls/new-controls.component";
import {ControlOptionsComponent} from "./control-options/control-options.component";
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';
import {FormService} from "../../../_components/dynamic-form-builder/services/form.service";
import {ApiFormService} from "../../../_services/api-form.service";
import {SharedFormBuilderModule} from "../../../_components/dynamic-form-builder/components/shared-form-builder.module";
import {User} from "../../../_auth/models/User";
import {AuthenticationService} from "../../../_auth/authentication.service";
import {MatSidenavModule} from "@angular/material/sidenav";
import {
  ConfigurationHistoryComponent
} from "../../configurations/view-configuration/configuration-history/configuration-history.component";
import {MatCardModule} from "@angular/material/card";
import {MatRippleModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormOptionsComponent} from "./form-options/form-options.component";
import {FormPageComponent} from "../../../_components/dynamic-form-builder/components/form-page/form-page.component";
import {UtilityService} from "../../../_components/dynamic-form-builder/services/utility.service";
import {IFormPage} from "../../../_components/dynamic-form-builder/models/form-container.interface";
import {Observable, Subscription} from "rxjs";
import {CanDeactivateType} from "../../../_helpers/guards/can-deactivate.guard";
import {IForm} from "../../../_components/dynamic-form-builder/models/form.interface";
import Swal from "sweetalert2";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-form',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    AsyncPipe,
    MatTabsModule,
    SharedFormBuilderModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatIconModule,
    FlexModule,
    NewControlsComponent,
    ControlOptionsComponent,
    NgIf,
    MatSidenavModule,
    ConfigurationHistoryComponent,
    MatCardModule,
    MatRippleModule,
    MatTooltipModule,
    FormOptionsComponent,
    FormPageComponent
  ],
  standalone: true
})
export class BuilderComponent implements OnInit, OnDestroy {
  tabIndex = 0;
  showInvisible = true;
  currentUser: User | undefined;
  loading$: Observable<boolean> | undefined;
  formSettings = false;
  settingsDrawer = false;
  lastSavedForm: IForm | null = null;
  private formServiceSubscription: Subscription | undefined;

  constructor(
    private authService: AuthenticationService,
    public formService: FormService,
    private route: ActivatedRoute,
    private apiFormService: ApiFormService,
    private location: Location,
    private utilityService: UtilityService,
    private _snackBar: MatSnackBar
  ) {
    this.formService.setForm(null);
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }

  ngOnInit() {
    this.loading$ = this.formService.loadingForm$;
    this.route.paramMap.subscribe(queryParams => {
      if (queryParams.get('formId') !== null) {
        this.apiFormService.getForm(queryParams.get('formId')!).subscribe(f => {
          this.lastSavedForm = JSON.parse(JSON.stringify(f));
          this.formService.setForm(f, {})
          this.formService.formGroup$.getValue().patchValue({});
        });
      } else {
        this.lastSavedForm = {
          title: 'Nieuw formulier',
          published: false,
          pages: [{
            controls: []
          }],
          options: {
            createQuotation: false
          }
        }
        this.formService.setForm(JSON.parse(JSON.stringify(this.lastSavedForm)))
      }
    });
    this.formServiceSubscription = this.formService.selectedControl$.subscribe(value => {
      this.settingsDrawer = !!value;
      this.formSettings = false;
    })
  }

  ngOnDestroy(): void {
    if (this.formServiceSubscription) {
      this.formServiceSubscription.unsubscribe();
    }
  }

  canDeactivate(): CanDeactivateType {
    if (JSON.stringify(this.lastSavedForm) !== JSON.stringify(this.formService.form$.value)) {
      return Swal.fire({
        title: "Pagina verlaten?",
        text: "Je hebt nog niet alles opgeslagen.",
        icon: "warning",
        showDenyButton: true,
        confirmButtonColor: '#2e3785',
        cancelButtonColor: '#d33',
        confirmButtonText: "Ja, verlaten",
        denyButtonText: `Annuleren`
      }).then((result) => {
        return result.isConfirmed;
      });
    } else {
      return true;
    }
  }

  openFormSettings() {
    this.settingsDrawer = true;
    this.formSettings = true;
  }

  get tabCount(): number {
    return this.formService.form$.getValue().pages.length;
  }

  public next() {
    window.scroll(0, 0);
    this.tabIndex = (this.tabIndex + 1) % this.tabCount;
  }

  public prev() {
    window.scroll(0, 0);
    this.tabIndex = (this.tabIndex - 1) % this.tabCount;
  }

  public showPage(page: IFormPage) {
    return (this.utilityService.isShow(page.dependent ?? []))
  }

  saveForm() {
    this.formService.setLoadingStatus(true);
    const form = this.formService.form$.getValue();
    form.updatedBy = this.currentUser?.name;
    this.apiFormService.saveForm(this.formService.form$.getValue()).subscribe( {
      next: (f) => {
        this.lastSavedForm = JSON.parse(JSON.stringify(f));
        this.formService.setForm(f);
        this.formService.setLoadingStatus(false);
        this.location.replaceState(`/admin/forms/${f.id}/builder`);
        this._snackBar.open('Formulier opgeslagen', '', {duration: 2000, horizontalPosition: 'end', verticalPosition: 'top', panelClass: ['snackbar-success']});
      },
      error: () => {
        this.formService.setLoadingStatus(false);
        this._snackBar.open('Kon formulier niet opslaan', '', {duration: 2000, horizontalPosition: 'end', verticalPosition: 'top', panelClass: ['snackbar-error']});
      }
    });
  }

  unSelect() {
    this.formService.onControlSelected(null);
  }
}
