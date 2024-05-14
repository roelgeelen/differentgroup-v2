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
import {IFormControl} from "../../../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {FormService} from "../../../../../_components/dynamic-form-builder/services/form.service";
import {IFormPage} from "../../../../../_components/dynamic-form-builder/models/form-container.interface";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {User} from "../../../../../_auth/models/User";
import {AuthenticationService} from "../../../../../_auth/authentication.service";
import {MatDialog} from "@angular/material/dialog";
import {AutocompleteFieldComponent} from "../../../../../_components/autocomplete-field/autocomplete-field.component";
import {TabSettingsDialogComponent} from "../../../ui/tab-settings-dialog/tab-settings-dialog.component";
import {TemplateService} from "../../../data-access/template.service";

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
    private templateService: TemplateService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }

  ngOnInit(): void {
    this.tableFields = this.formService.getAvailableFields((control) => {
      return control.type === 'Table'
    });
    this.numberFields = this.formService.getAvailableFields((control) => {
      return control.options?.type === 'number'
    });
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

  controlSearchFunction(option: any): string {
    return option?.options?.label !== '' ? option?.options?.label : option?.options?.title ?? '';
  }

  valueFunction(option: any): any {
    return option.id;
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
        this.templateService.deleteTemplate(this.formService.form$.getValue().id!.toString()).subscribe(f => this.router.navigateByUrl('/admin/forms'))
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
    switch ($event) {
      case 'odo':
      case 'old':
        this.formService.form$.getValue().options.quoteSizeFields = {
          height: null,
          width: null
        }
        break;
      case 'sdh':
      case 'zsdh':
        this.formService.form$.getValue().options.quoteSizeFields = {
          sizeTable: null
        }
        break;
      default:
        this.formService.form$.getValue().options.quoteSizeFields = {}
    }
  }

  close() {
    this.onClose.emit();
  }

  openDialog(page: IFormPage) {
    this.dialog.open(TabSettingsDialogComponent, {
      data: page,
    });
  }
}
