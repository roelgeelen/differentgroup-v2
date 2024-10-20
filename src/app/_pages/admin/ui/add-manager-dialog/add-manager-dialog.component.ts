import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDivider} from "@angular/material/divider";
import {AutocompleteFieldComponent} from "../../../../_components/autocomplete-field/autocomplete-field.component";
import {IUser} from "../../utils/user";
import {EmployeeService} from "../../data-access/employee.service";

@Component({
  selector: 'add-manager-dialog',
  templateUrl: './add-manager-dialog.component.html',
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
  styleUrl: './add-manager-dialog.component.scss'
})
export class AddManagerDialogComponent {
  email = '';
  sharedError = '';

  constructor(
    public dialogRef: MatDialogRef<AddManagerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUser,
    private employeeService: EmployeeService,
  ) {
  }

  onNoClick(): void {
    if (this.email == '') {
      this.sharedError = 'Vul eerst een geldige gebruiker in!';
      return;
    }
    let managers = [...this.data.app_metadata?.managers||[], this.email + '@differentdoors.nl'];
    this.employeeService.patchEmployeeManagers(this.data.user_id, managers).subscribe({
      next: data => {
        if (this.data.app_metadata==undefined){
          this.data.app_metadata={};
        }
        this.data.app_metadata['managers'] = managers;
        this.dialogRef.close();
      },
      error: err => {this.sharedError = "Kon nieuwe manager niet toevoegen"; console.log(err); return;}
    })
  }
}
