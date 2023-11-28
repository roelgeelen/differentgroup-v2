import {Component, Input, OnInit} from '@angular/core';
import {FormControlBase} from "../model/form-fields";
import {Editor, Toolbar} from "ngx-editor";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {v4 as uuidV4} from "uuid";

@Component({
  selector: 'form-builder-control',
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.scss'
})
export class FormControlComponent implements OnInit{
  @Input() formField!: FormControlBase;
  @Input() selected: boolean = false;
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor() {
    this.editor = new Editor();
  }

  ngOnInit() {
    if (this.formField.element.columns !== undefined) {
      if (Array.isArray(this.formField.components)) {
        for (let i = 0; i < this.formField.element.columns; i++) {
          this.formField.components.push([]);
        }
      }
      console.log(this.formField.components)
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const clone = JSON.parse(JSON.stringify(event.previousContainer.data[event.previousIndex]));
      clone.id = uuidV4();
      event.container.data.splice(event.currentIndex, 0, clone);
    }
  }
}
