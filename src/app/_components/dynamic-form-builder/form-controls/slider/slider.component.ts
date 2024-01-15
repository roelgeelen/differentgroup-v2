import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { Slider } from './slider.class';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent extends FormControlComponentBase<Slider> implements OnInit {
  @Input() form!: FormGroup;
  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
