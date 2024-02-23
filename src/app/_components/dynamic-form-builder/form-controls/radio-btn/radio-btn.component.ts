import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { RadioBtn } from './radio-btn.class';
import {FormGroup} from "@angular/forms";
import {FormService} from "../../services/form.service";

@Component({
  selector: 'app-radio-btn',
  templateUrl: './radio-btn.component.html',
  styleUrls: ['./radio-btn.component.scss']
})
export class RadioBtnComponent extends FormControlComponentBase<RadioBtn> implements OnInit {
  @Input() form!: FormGroup;

  customValue:string|null = null;
  constructor(protected formService: FormService) {
    super();
  }

  ngOnInit(): void {
    const val = this.form.controls[this.control!.id!].value;
    if (val!=='' && !this.control?.options?.choices?.some(choice => choice.value === val)){
      this.customValue = this.form.controls[this.control!.id!].value
    }
  }
  updateCustom() {
    this.form.controls[this.control!.id!].patchValue(this.customValue);
  }
}
