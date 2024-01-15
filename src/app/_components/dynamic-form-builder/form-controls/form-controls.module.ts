import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SliderComponent} from './slider/slider.component';
import {DropdownComponent} from './dropdown/dropdown.component';

import {CheckBoxComponent} from './check-box/check-box.component';
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {InfoBoxComponent} from "./info-box/info-box.component";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {RadioBtnComponent} from "./radio-btn/radio-btn.component";
import {MatRadioModule} from "@angular/material/radio";
import {TextAreaComponent} from "./text-area/text-area.component";
import {NgxEditorModule} from "ngx-editor";
import {DividerComponent} from "./divider/divider.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared.module";
import {UploadComponent} from "./upload/upload.component";
import {DndDirective} from "../../../_helpers/directives/dnd.directive";
import {FileFormControlComponent} from "./upload/file-form-control.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {InfoImageComponent} from "./info-image/info-image.component";
import {MatSliderModule} from "@angular/material/slider";
import {TextBoxComponent} from "./text-box/text-box.component";
import {SliderFormControlComponent} from "./slider/slider-form-control.component";



@NgModule({
  declarations: [
    SliderComponent,
    InfoImageComponent,
    DropdownComponent,
    CheckBoxComponent,
    InfoBoxComponent,
    RadioBtnComponent,
    TextAreaComponent,
    DividerComponent,
    UploadComponent,
    TextBoxComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatRadioModule,
    NgxEditorModule,
    FormsModule,
    ReactiveFormsModule,
    DndDirective,
    FileFormControlComponent,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
SliderFormControlComponent
  ],
  exports: [
    SliderComponent,
    DropdownComponent,
    CheckBoxComponent,
    InfoBoxComponent,
    RadioBtnComponent,
    TextAreaComponent,
    DividerComponent,
    UploadComponent,
    InfoImageComponent,
    TextBoxComponent
  ],
})
export class FormControlsModule {
}
