import {Component, Inject} from '@angular/core';
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
  ],
  styleUrl: './choice-dialog.component.scss'
})
export class ChoiceDialogComponent {
  constructor(
    protected formService: FormService,
    public dialogRef: MatDialogRef<ChoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFormControlOptionsChoices,
  ) {}

  addQuoteLine(){
    this.data.quoteLine = {sku:'', order:100}
  }

  removeQuoteLine(){
    this.data.quoteLine = undefined;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
