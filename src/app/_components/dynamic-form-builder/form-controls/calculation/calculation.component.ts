import {Component, Input} from '@angular/core';
import {FormControlComponentBase} from '../control-component-base.class';
import {Calculation} from './calculation.class';
import {FormGroup} from "@angular/forms";
import {FormService} from "../../services/form.service";


@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent extends FormControlComponentBase<Calculation> {
  @Input() form!: FormGroup;

  constructor(protected formService: FormService) {
    super()
  }
}
