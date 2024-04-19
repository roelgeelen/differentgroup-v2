import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControlComponentBase} from '../control-component-base.class';
import {TextArea} from './text-area.class';
import {Editor, Toolbar} from "ngx-editor";
import {FormGroup} from "@angular/forms";
import {FormService} from "../../services/form.service";

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent extends FormControlComponentBase<TextArea> implements OnDestroy{
  @Input() form!: FormGroup;
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
  constructor(protected formService: FormService) {
    super();
    this.editor = new Editor();
  }

  ngOnDestroy() {
    this.editor?.destroy()

  }
}
