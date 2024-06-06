import {Component, Input} from '@angular/core';
import {FormControlComponentBase} from '../control-component-base.class';
import {Calculation} from './calculation.class';
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import {FormService} from "../../services/form.service";
import { CalculationFormControlComponent } from './calculation-form-control.component';


@Component({
    selector: 'app-calculation',
    templateUrl: './calculation.component.html',
    styleUrls: ['./calculation.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, CalculationFormControlComponent]
})
export class CalculationComponent extends FormControlComponentBase<Calculation> {
  @Input() form!: FormGroup;

  constructor(protected formService: FormService) {
    super()
  }
}
