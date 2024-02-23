import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { Dropdown } from './dropdown.class';
import {FormGroup} from "@angular/forms";
import {FormService} from "../../services/form.service";

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent extends FormControlComponentBase<Dropdown> implements OnInit {
  @Input() form!: FormGroup;
  constructor(protected formService: FormService) {
    super()
  }

  ngOnInit(): void {
  }

}
