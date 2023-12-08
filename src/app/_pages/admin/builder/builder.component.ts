import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {AsyncPipe} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {FlexModule} from "@angular/flex-layout";
import {NewControlsComponent} from "./new-controls/new-controls.component";
import {ControlOptionsComponent} from "./control-options/control-options.component";
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';
import {
  FormContainerComponent
} from "../../../_components/dynamic-form-builder/components/form-container/form-container.component";
import {FormService} from "../../../_components/dynamic-form-builder/services/form.service";
import {ApiFormService} from "../../../_services/api-form.service";
import {SharedFormBuilderModule} from "../../../_components/dynamic-form-builder/components/shared-form-builder.module";
import {User} from "../../../_auth/models/User";
import {AuthenticationService} from "../../../_auth/authentication.service";

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
    ControlOptionsComponent
  ],
  standalone: true
})
export class BuilderComponent implements OnInit {
  tabIndex = 0;
  showInvisible = true;
  currentUser: User | undefined;

  constructor(
    private authService: AuthenticationService,
    public formService: FormService,
    private route: ActivatedRoute,
    private apiFormService: ApiFormService,
    private location: Location,
  ) {
    this.formService.setForm(null);
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }

  async ngOnInit() {
    this.route.paramMap.subscribe(queryParams => {
      if (queryParams.get('formId') !== null) {
        this.apiFormService.getForm(queryParams.get('formId')!).subscribe(f => this.formService.setForm(f));
      } else {
        this.formService.setForm({
          title: 'Nieuw formulier',
          published: false,
          pages: [{
            controls: []
          }],
          options: {
            createQuotation: false
          }
        })
      }
    });
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

  submit() {
    console.log(JSON.stringify(this.formService.form$.getValue()));
  }

  saveForm() {
    const form = this.formService.form$.getValue();
    form.updatedBy = this.currentUser?.name;
    this.apiFormService.saveForm(this.formService.form$.getValue()).subscribe(f => {
      this.formService.setForm(f);
      this.location.replaceState(`/admin/forms/${f.id}/builder`);
    } );
  }

  unSelect() {
    this.formService.onControlSelected(null);
  }
}