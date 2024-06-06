import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { RadioBtn } from './radio-btn.class';
import { FormGroup, ReactiveFormsModule, FormsModule } from "@angular/forms";
import {FormService} from "../../services/form.service";
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';

@Component({
    selector: 'app-radio-btn',
    templateUrl: './radio-btn.component.html',
    styleUrls: ['./radio-btn.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatRadioGroup, MatRadioButton, MatIcon, MatTooltip, MatFormField, MatLabel, MatInput, FormsModule]
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
