import {Component, OnInit} from '@angular/core';
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";
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
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatRippleModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {SharedModule} from "../../../../shared.module";
import {IFormControl} from "../../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {FormService} from "../../../../_components/dynamic-form-builder/services/form.service";
import {
  IFormControlOptionsChoices
} from "../../../../_components/dynamic-form-builder/form-controls/form-control-options-choices.interface";
import {IFormPage} from "../../../../_components/dynamic-form-builder/models/form-container.interface";
import {
  IFormControlOptionsDependent
} from "../../../../_components/dynamic-form-builder/form-controls/form-control-options-dependent.interface";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {map, Observable, startWith} from "rxjs";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";
import Swal from "sweetalert2";
import {ApiFormService} from "../../../../_services/api-form.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-control-options',
  templateUrl: './control-options.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
    FormsModule,
    NgxEditorModule,
    MatSelectModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
    SharedModule,
    MatSlideToggleModule,
    MatCardModule,
    MatDividerModule,
    MatRippleModule,
    MatTooltipModule,
    MatAutocompleteModule,
    SweetAlert2Module
  ],
  styleUrl: './control-options.component.scss'
})
export class ControlOptionsComponent implements OnInit {
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['text_color', 'background_color'],
  ];
  inputTypes: { value: string, name: string }[] = [
    {value: 'text', name: 'Tekst'},
    {value: 'number', name: 'Nummer'},
    {value: 'date', name: 'Datum'},
    {value: 'datetime-local', name: 'Datum tijd'},
    {value: 'email', name: 'Email'},
    {value: 'month', name: 'Maand'},
    {value: 'tel', name: 'Telefoon'},
    {value: 'time', name: 'Tijd'},
    {value: 'url', name: 'Url'},
    {value: 'week', name: 'Week'}
  ]
  myControl = new FormControl<IFormControl | null>(null, Validators.required);
  filteredOptions: Observable<IFormControl[]> | undefined;

  constructor(
    public formService: FormService,
    private apiFormService: ApiFormService,
    private router: Router
  ) {
    this.editor = new Editor();
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.options?.label;
        return name ? this._filter(name as string) : this.getAvailableDependentFields.slice();
      }),
    );
  }

  displayFn(control: IFormControl): string {
    return control?.options?.label ?? '';
  }

  private _filter(name: string): IFormControl[] {
    const filterValue = name.toLowerCase();

    return this.getAvailableDependentFields.filter(option => option.options!.label!.toLowerCase().includes(filterValue));
  }

  get control() {
    return this.formService.selectedControl$.getValue()!;
  }

  get formControl() {
    return this.formService.formGroup$.getValue()!.controls[this.control.id];
  }


  drop(choices: any[], event: CdkDragDrop<string[]>) {
    moveItemInArray(choices, event.previousIndex, event.currentIndex);
  }

  addChoice(choices: IFormControlOptionsChoices[]) {
    choices.push({value: 'Optie'})
  }

  addTab(choices: IFormPage[]) {
    choices.push({
      tab: 'Pagina',
      controls: []
    })
  }

  addDependent(dependents: IFormControlOptionsDependent[]) {
    if (this.myControl.value !== null) {
      dependents.push({
        field: this.myControl.getRawValue()!.id, values: []
      });
      this.myControl.reset();
    }
  }

  removeFromList(choices: any[], index: number) {
    choices.splice(index, 1);
  }

  get getAvailableDependentFields() {
    const dependentIds = this.control.options!.dependent!.map(dependent => dependent.field);
    const list: IFormControl[] = [];
    const formControls = this.formService.form$.getValue().pages.flatMap(page => page.controls);

    const isEligibleControl = (control: IFormControl) => {
      return (
        this.control.id !== control.id &&
        !dependentIds.includes(control.id) &&
        (control.type === 'RadioBtn' || control.type === 'CheckBox' || control.type === 'Dropdown')
      );
    };

    const pushControlToList = (control: IFormControl) => {
      if (isEligibleControl(control)) {
        list.push(control);
      }
    };

    formControls.forEach(control => {
      if ((control.type === 'Columns' && control.columns) && this.control.id !== control.id) {
        control.columns.forEach(col => {
          col.container.controls.forEach(subControl => {
            pushControlToList(subControl);
          });
        });
      } else {
        pushControlToList(control);
      }
    });

    return list;
  }

  updateValue($event: Event) {
    this.formControl.setValue($event);
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
        this.apiFormService.deleteForm(this.formService.form$.getValue().id!.toString()).subscribe()
        this.router.navigateByUrl('/admin/forms')
      }
    });
  }
}
