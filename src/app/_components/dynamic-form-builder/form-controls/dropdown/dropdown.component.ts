import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { Dropdown } from './dropdown.class';
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import {FormService} from "../../services/form.service";
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import {MatTooltip} from "@angular/material/tooltip";

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    standalone: true,
  imports: [MatFormField, ReactiveFormsModule, MatLabel, MatSelect, MatOption, MatIcon, MatTooltip]
})
export class DropdownComponent extends FormControlComponentBase<Dropdown> implements OnInit {
  @Input() form!: FormGroup;
  constructor(protected formService: FormService) {
    super()
  }

  ngOnInit(): void {
  }

}
