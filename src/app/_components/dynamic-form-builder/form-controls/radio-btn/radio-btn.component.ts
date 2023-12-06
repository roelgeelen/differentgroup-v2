import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { RadioBtn } from './radio-btn.class';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-radio-btn',
  templateUrl: './radio-btn.component.html',
  styleUrls: ['./radio-btn.component.scss']
})
export class RadioBtnComponent extends FormControlComponentBase<RadioBtn> implements OnInit {
  @Input() form!: FormGroup;
  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
