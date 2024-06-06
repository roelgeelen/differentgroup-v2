import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { CheckBox } from './check-box.class';
import { FormGroup, ReactiveFormsModule, FormsModule } from "@angular/forms";
import {FormService} from "../../services/form.service";
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatSelectionList, MatListOption } from '@angular/material/list';

@Component({
    selector: 'app-check-box',
    templateUrl: './check-box.component.html',
    styleUrls: ['./check-box.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, MatSelectionList, MatListOption, MatIcon, MatTooltip, MatFormField, MatLabel, MatInput, FormsModule]
})
export class CheckBoxComponent extends FormControlComponentBase<CheckBox> implements OnInit {
  @Input() form!: FormGroup;
  customValue:string|null = null;
  constructor(protected formService: FormService) {
    super();
  }

  ngOnInit(): void {
    if (this.control) {
      this.form.controls[this.control.id].value.forEach((val: any) => {
        if (val !== '' && !this.control?.options?.choices?.some(choice => choice.value === val)) {
          this.customValue = val;
        }
      })
    }
  }

}
