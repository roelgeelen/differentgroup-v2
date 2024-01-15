import { Component, OnInit } from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { InfoImage } from './info-image.class';

@Component({
  selector: 'app-info-image',
  templateUrl: './info-image.component.html',
  styleUrls: ['./info-image.component.scss']
})
export class InfoImageComponent extends FormControlComponentBase<InfoImage> implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
