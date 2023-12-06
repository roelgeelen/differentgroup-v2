import { Component, OnInit } from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { InfoBox } from './info-box.class';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent extends FormControlComponentBase<InfoBox> implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
