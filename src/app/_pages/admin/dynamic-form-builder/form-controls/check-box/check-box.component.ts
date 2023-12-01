import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { CheckBox } from './check-box.class';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss']
})
export class CheckBoxComponent extends FormControlComponentBase<CheckBox> implements OnInit {
  @Input() form!: FormGroup;
  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
