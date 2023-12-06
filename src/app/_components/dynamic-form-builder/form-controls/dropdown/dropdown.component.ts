import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { Dropdown } from './dropdown.class';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent extends FormControlComponentBase<Dropdown> implements OnInit {
  @Input() form!: FormGroup;
  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
