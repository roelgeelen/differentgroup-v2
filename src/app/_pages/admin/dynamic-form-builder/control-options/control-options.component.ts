import {Component, OnInit} from '@angular/core';
import {FormService} from "../services/form.service";
import {Editor, Toolbar} from "ngx-editor";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {IFormControlOptionsChoices} from "../form-controls/form-control-options-choices.interface";
import {IFormPage} from "../models/form-container.interface";
import {InfoBox} from "../form-controls/info-box/info-box.class";
import {TextBox} from "../form-controls/text-box/text-box.class";
import {Columns} from "../form-controls/columns/columns.class";
import {IFormControlOptionsDependent} from "../form-controls/form-control-options-dependent.interface";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
import {IFormControl} from "../form-controls/form-control.interface";
import {NgxDropdownConfig} from "ngx-select-dropdown";

@Component({
  selector: 'app-control-options',
  templateUrl: './control-options.component.html',
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
  newDependent: IFormControl | null = null;
  config: NgxDropdownConfig = {
    clearOnSelection: false,
    customComparator(a: any, b: any): number {
      return 0;
    },
    displayFn: (item: any) => {
      return item.options.label;
    },
    displayKey: '',
    height: "auto",
    inputDirection: "",
    limitTo: 0,
    moreText: "Meer...",
    noResultsFound: "Geen velden gevonden...",
    placeholder: "Kies veld",
    search: true,
    searchOnKey: "",
    searchPlaceholder: "Zoeken"

  }

  constructor(public formService: FormService) {
    this.editor = new Editor();
  }

  ngOnInit(): void {
  }

  get control() {
    return this.formService.selectedControl$.getValue()!;
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
    dependents.push({
      field: this.newDependent!.id, values: []
    });
    this.newDependent = null;
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
      if (control.type === 'Columns' && control.columns) {
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

}
