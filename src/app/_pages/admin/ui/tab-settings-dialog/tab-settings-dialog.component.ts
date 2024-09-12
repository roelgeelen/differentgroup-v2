import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormService} from "../../../../_components/dynamic-form-builder/services/form.service";
import {MatDivider} from "@angular/material/divider";
import {IFormControl} from "../../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {AutocompleteFieldComponent} from "../../../../_components/autocomplete-field/autocomplete-field.component";
import {IFormPage} from "../../../../_components/dynamic-form-builder/models/form-container.interface";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-choice-dialog',
  templateUrl: './tab-settings-dialog.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatIconModule,
    MatTooltipModule,
    MatDivider,
    AutocompleteFieldComponent,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
  ],
  styleUrl: './tab-settings-dialog.component.scss'
})
export class TabSettingsDialogComponent {
  dependentControl = new FormControl<IFormControl | null>(null, Validators.required);
  dependentFields: IFormControl[] = [];

  constructor(
    protected formService: FormService,
    public dialogRef: MatDialogRef<TabSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFormPage,
  ) {
    this.dependentFields = this.getAvailableDependentFields;
  }

  get getAvailableDependentFields() {
    if (!this.data.dependent){
      this.data.dependent = [];
    }
    const dependentIds = this.data.dependent!.map(dependent => dependent.field);
    const list: IFormControl[] = [];

    const pushControlToList = (control: IFormControl) => {
      if (!dependentIds.includes(control.id) &&
        (control.type === 'RadioBtn' || control.type === 'CheckBox' || control.type === 'Dropdown')) {
        list.push(control);
      }
    };
    this.formService.form$.getValue().pages.forEach(page => {
      if (page!==this.data){
        page.controls.forEach(control => {
          if ((control.type === 'Columns' && control.columns)) {
            control.columns.forEach(col => {
              col.container.controls.forEach(subControl => {
                pushControlToList(subControl);
              });
            });
          } else {
            pushControlToList(control);
          }
        });
      }
    })

    return list;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  dependentSearchFunction(option: any): string {
    return option?.options?.label ?? '';
  }

  addDependent() {
    if (this.dependentControl.value !== null) {
      this.data.dependent!.push({
        field: this.dependentControl.getRawValue()!.id, values: []
      });
      this.dependentControl.reset();
    }
  }

  removeFromList(choices: any[], index: number) {
    choices.splice(index, 1);
  }
}
