import {Component, OnInit} from '@angular/core';
import {FormService} from "../services/form.service";
import {Editor, Toolbar} from "ngx-editor";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {IFormControlOptionsChoices} from "../form-controls/form-control-options-choices.interface";
import {IFormPage} from "../models/form-container.interface";
import {InfoBox} from "../form-controls/info-box/info-box.class";
import {TextBox} from "../form-controls/text-box/text-box.class";
import {Columns} from "../form-controls/columns/columns.class";

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

  constructor(public formService: FormService) {
    this.editor = new Editor();
  }

  ngOnInit(): void {
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

  removeOption(choices: any[], index: number) {
    choices.splice(index, 1);
  }
}
