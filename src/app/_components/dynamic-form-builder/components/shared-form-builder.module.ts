import {NgModule} from "@angular/core";
import {FormContainerComponent} from "./form-container/form-container.component";
import {FormColumnsComponent} from "./form-columns/form-columns.component";
import {MatButtonModule} from "@angular/material/button";
import {CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDragPreview, CdkDropList} from "@angular/cdk/drag-drop";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe, NgTemplateOutlet} from "@angular/common";
import {FormControlsModule} from "../form-controls/form-controls.module";


@NgModule({
  declarations: [
    FormContainerComponent,
    FormColumnsComponent
  ],
  imports: [
    MatButtonModule,
    CdkDropList,
    CdkDrag,
    MatFormFieldModule,
    MatIconModule,
    CdkDragPlaceholder,
    CdkDragPreview,
    NgTemplateOutlet,
    AsyncPipe,
    FormControlsModule,
    CdkDragHandle
  ],
  exports: [FormContainerComponent, FormColumnsComponent]
})
export class SharedFormBuilderModule{}
