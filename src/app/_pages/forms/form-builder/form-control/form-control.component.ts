import {Component, Input} from '@angular/core';
import {FormControlBase} from "../model/form-fields";

@Component({
  selector: 'form-builder-control',
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.scss'
})
export class FormControlComponent {
  @Input() formField!: FormControlBase;
  @Input() selected: boolean = false;
}
