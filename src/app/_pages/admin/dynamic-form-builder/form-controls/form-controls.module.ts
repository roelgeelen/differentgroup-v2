import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TextBoxComponent} from './text-box/text-box.component';
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
import {SharedModule} from "../../../../shared.module";
import {DividerComponent} from "./divider/divider.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    TextBoxComponent,
    DropdownComponent,
    CheckBoxComponent,
    InfoBoxComponent,
    RadioBtnComponent,
    TextAreaComponent,
    DividerComponent
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
  ],
  exports: [
    TextBoxComponent,
    DropdownComponent,
    CheckBoxComponent,
    InfoBoxComponent,
    RadioBtnComponent,
    TextAreaComponent,
    DividerComponent
  ],
})
export class FormControlsModule {
}
