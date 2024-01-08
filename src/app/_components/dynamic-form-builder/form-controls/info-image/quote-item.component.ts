import { Component, OnInit } from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { InfoImage } from './quote-item.class';

@Component({
  selector: 'app-info-image',
  templateUrl: './quote-item.component.html',
  styleUrls: ['./quote-item.component.scss']
})
export class QuoteItemComponent extends FormControlComponentBase<InfoImage> implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
