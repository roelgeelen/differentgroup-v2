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
  customValue:string|null = null;
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form.controls[this.control!.id!].value.forEach((val: any) => {
      if (val!=='' && !this.control?.options?.choices?.some(choice => choice.value === val)){
        this.customValue =val;
      }
    })

  }

}
