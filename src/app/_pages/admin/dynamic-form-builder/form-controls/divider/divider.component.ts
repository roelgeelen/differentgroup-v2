import { Component, OnInit } from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { Divider } from './divider.class';

@Component({
  selector: 'app-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent extends FormControlComponentBase<Divider> implements OnInit {

  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
