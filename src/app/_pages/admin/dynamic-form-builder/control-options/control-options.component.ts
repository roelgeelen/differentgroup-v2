import {Component, OnInit} from '@angular/core';
import {FormService} from "../services/form.service";
import {Editor, Toolbar} from "ngx-editor";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {IFormControlOptionsChoices} from "../form-controls/form-control-options-choices.interface";

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

  ngOnInit(): void {}

  drop(choices: IFormControlOptionsChoices[], event: CdkDragDrop<string[]>) {
    moveItemInArray(choices, event.previousIndex, event.currentIndex);
  }

  addOption(choices: IFormControlOptionsChoices[]) {
    choices.push({value: 'Optie'})
  }

  removeOption(choices: IFormControlOptionsChoices[], index: number) {
    choices.splice(index, 1);
  }
}
