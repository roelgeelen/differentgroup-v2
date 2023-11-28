import { Component, OnInit } from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { RadioBtn } from './radio-btn.class';

@Component({
  selector: 'app-radio-btn',
  templateUrl: './radio-btn.component.html',
  styleUrls: ['./radio-btn.component.scss']
})
export class RadioBtnComponent extends FormControlComponentBase<RadioBtn> implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
