import {AfterViewInit, Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {
  IFormControlOptionsChoices
} from "../../../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {FormService} from "../../../../../_components/dynamic-form-builder/services/form.service";
import {MatDivider} from "@angular/material/divider";
import {IFormControl} from "../../../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {AutocompleteFieldComponent} from "../../../../../_components/autocomplete-field/autocomplete-field.component";

@Component({
  selector: 'app-choice-dialog',
  templateUrl: './choice-dialog.component.html',
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
  ],
  styleUrl: './choice-dialog.component.scss'
})
export class ChoiceDialogComponent {
  numberFields: IFormControl[] = [];

  constructor(
    protected formService: FormService,
    public dialogRef: MatDialogRef<ChoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFormControlOptionsChoices,
  ) {
    this.numberFields = this.formService.setAvailableFields((control) => {
      return control.options?.type === 'number'
    })
  }

  addQuoteLine() {
    this.data.quoteLine = {sku: '', order: 100}
  }

  removeQuoteLine() {
    this.data.quoteLine = undefined;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  controlSearchFunction(option: any): string {
    return option?.options?.label !== '' ? option?.options?.label : option?.options?.title ?? '';
  }

  valueFunction(option: any): any {
    return option.id;
  }
}
