import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { Slider } from './slider.class';
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import {FormService} from "../../services/form.service";
import { SliderFormControlComponent } from './slider-form-control.component';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, SliderFormControlComponent]
})
export class SliderComponent extends FormControlComponentBase<Slider> implements OnInit {
  @Input() form!: FormGroup;
  constructor(protected formService: FormService) {
    super()
  }

  ngOnInit(): void {
  }

}
