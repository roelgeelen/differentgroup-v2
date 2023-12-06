import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { TextBox } from './text-box.class';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent extends FormControlComponentBase<TextBox> implements OnInit {
  @Input() form!: FormGroup;
  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
