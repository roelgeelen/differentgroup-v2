import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray
} from "@angular/cdk/drag-drop";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {AsyncPipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatRippleModule} from "@angular/material/core";
import {IFormControl} from "../../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {FormService} from "../../../../_components/dynamic-form-builder/services/form.service";
import {IFormPage} from "../../../../_components/dynamic-form-builder/models/form-container.interface";
import Swal from "sweetalert2";
import {ApiFormService} from "../../../../_services/api-form.service";
import {Router} from "@angular/router";
import {User} from "../../../../_auth/models/User";
import {AuthenticationService} from "../../../../_auth/authentication.service";
import {MatDialog} from "@angular/material/dialog";
import {AutocompleteFieldComponent} from "../../../../_components/autocomplete-field/autocomplete-field.component";

@Component({
  selector: 'app-form-options',
  templateUrl: './form-options.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatRippleModule,
    FormsModule,
    AsyncPipe,
    CdkDropList,
    MatButtonModule,
    CdkDragHandle,
    CdkDrag,
    CdkDragPlaceholder,
    MatSelectModule,
    AutocompleteFieldComponent,
    MatDividerModule
  ],
  styleUrl: '../control-options/control-options.component.scss'
})
export class FormOptionsComponent implements OnInit {
  currentUser: User | undefined;
  numberFields: IFormControl[] = [];
  tableFields: IFormControl[] = [];
  @Output() onClose = new EventEmitter<any>();

  constructor(
    private authService: AuthenticationService,
    public formService: FormService,
    private apiFormService: ApiFormService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }

  ngOnInit(): void {
    this.setAvailableFields();
  }

  get control() {
    return this.formService.selectedControl$.getValue()!;
  }

  drop(choices: any[], event: CdkDragDrop<string[]>) {
    moveItemInArray(choices, event.previousIndex, event.currentIndex);
  }

  addTab(choices: IFormPage[]) {
    choices.push({
      tab: 'Pagina',
      controls: []
    })
  }

  removeFromList(choices: any[], index: number) {
    choices.splice(index, 1);
  }

  setAvailableFields() {
    const numericFieldList: IFormControl[] = [];
    const tableList: IFormControl[] = [];
    const formControls = this.formService.form$.getValue().pages.flatMap(page => page.controls);

    const pushControlToList = (control: IFormControl) => {
      if (control.options?.type === 'number') {
        numericFieldList.push(control);
      }
      if (control.type === 'Table') {
        tableList.push(control);
      }
    };

    formControls.forEach(control => {
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

    this.numberFields = numericFieldList;
    this.tableFields = tableList;
  }

  controlSearchFunction(option: any): string {
    return option?.options?.label !== '' ? option?.options?.label : option?.options?.title ?? '';
  }

  deleteForm() {
    Swal.fire({
      title: 'Weet je het zeker?',
      text: 'Wil je dit formulier verwijderen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e3785',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ja, verwijderen!',
      cancelButtonText: 'Annuleren',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiFormService.deleteForm(this.formService.form$.getValue().id!.toString()).subscribe(f => this.router.navigateByUrl('/admin/forms'))
      }
    });
  }

  addQuoteLine() {
    if (this.formService.form$.getValue().options.quoteLines === undefined) {
      this.formService.form$.getValue().options.quoteLines = [];
    }
    this.formService.form$.getValue().options.quoteLines!.push({sku: '', order: 100});
  }

  propertyExists(property: string, object: any) {
    return property in object;
  }

  selectSizeCalculation($event: any) {
    if ($event === 'odo') {
      this.formService.form$.getValue().options.quoteSizeFields = {
        height: null,
        width: null
      }
    }
    if ($event === 'sdh') {
      this.formService.form$.getValue().options.quoteSizeFields = {
        sizeTable: null
      }
    }
  }

  close() {
    this.onClose.emit();
  }
}
