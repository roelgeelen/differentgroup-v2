import { Component, OnInit } from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { InfoBox } from './info-box.class';
import { SafeHtmlPipe } from '../../../../_helpers/pipes/safe-html.pipe';

@Component({
    selector: 'app-info-box',
    templateUrl: './info-box.component.html',
    styleUrls: ['./info-box.component.scss'],
    standalone: true,
    imports: [SafeHtmlPipe]
})
export class InfoBoxComponent extends FormControlComponentBase<InfoBox> implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
