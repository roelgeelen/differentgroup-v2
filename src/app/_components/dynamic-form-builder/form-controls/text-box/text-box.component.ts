import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { TextBox } from './text-box.class';
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import {FormService} from "../../services/form.service";
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';

@Component({
    selector: 'app-text-box',
    templateUrl: './text-box.component.html',
    styleUrls: ['./text-box.component.scss'],
    standalone: true,
    imports: [MatFormField, ReactiveFormsModule, MatLabel, MatInput, MatHint]
})
export class TextBoxComponent extends FormControlComponentBase<TextBox> implements OnInit {
  @Input() form!: FormGroup;
  constructor(protected formService: FormService) {
    super()
  }

  ngOnInit(): void {
  }

}
