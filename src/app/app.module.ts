import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {OAuthModule} from "angular-oauth2-oidc";
import {environment} from "../environments/environment";
import {HttpClientModule} from "@angular/common/http";
import { HomeComponent } from './_pages/home/home.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {NavbarComponent} from "./_helpers/components/navbar/navbar.component";
import { FormsComponent } from './_pages/forms/forms.component';
import { AdminComponent } from './_pages/admin/admin.component';
import {
  CdkDrag,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList,
  CdkDropListGroup
} from "@angular/cdk/drag-drop";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatGridListModule} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import { FormControlComponent } from './_pages/forms/form-builder/form-control/form-control.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { FormControlOptionsComponent } from './_pages/forms/form-builder/form-control-options/form-control-options.component';
import {NgxEditorModule} from "ngx-editor";
import {MatSelectModule} from "@angular/material/select";
import { NewControlsComponent } from './_pages/admin/dynamic-form-builder/new-controls/new-controls.component';
import {FormComponent} from "./_pages/admin/dynamic-form-builder/form/form.component";
import {FormColumnsComponent} from "./_pages/admin/dynamic-form-builder/form/form-columns/form-columns.component";
import {FormContainerComponent} from "./_pages/admin/dynamic-form-builder/form/form-container/form-container.component";
import {FormControlsModule} from "./_pages/admin/dynamic-form-builder/form-controls/form-controls.module";
import {CastPipe} from "./_pages/admin/dynamic-form-builder/cast.pipe";
import { ControlOptionsComponent } from './_pages/admin/dynamic-form-builder/control-options/control-options.component';
import {SharedModule} from "./shared.module";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTooltipModule} from "@angular/material/tooltip";
import {SelectDropDownModule} from "ngx-select-dropdown";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FormsComponent,
    AdminComponent,
    FormControlComponent,
    FormControlOptionsComponent,
    NewControlsComponent,
    FormComponent,
    FormComponent,
    FormContainerComponent,
    FormColumnsComponent,
    CastPipe,
    ControlOptionsComponent
  ],
  imports: [
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.apiUrl],
        sendAccessToken: true
      }
    }),
    SharedModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    NavbarComponent,
    CdkDropList,
    MatFormFieldModule,
    CdkDrag,
    MatInputModule,
    MatSidenavModule,
    MatGridListModule,
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    CdkDropListGroup,
    MatRadioModule,
    MatCheckboxModule,
    CdkDragPlaceholder,
    CdkDragHandle,
    NgxEditorModule,
    MatSelectModule,
    FormControlsModule,
    CdkDragPreview,
    MatTabsModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTooltipModule,
    SelectDropDownModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
