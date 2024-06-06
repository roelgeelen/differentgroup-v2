import {Component, forwardRef, Input} from '@angular/core';
import {Columns} from "../../form-controls/columns/columns.class";
import { FormContainerComponent } from '../form-container/form-container.component';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';


@Component({
    selector: 'app-form-columns',
    templateUrl: './form-columns.component.html',
    styleUrls: ['./form-columns.component.scss'],
    standalone: true,
  imports: [MatMiniFabButton, MatIcon, forwardRef(() => FormContainerComponent), FormContainerComponent]
})
export class FormColumnsComponent {
  @Input() showInvisible = false;
  @Input() isBuilder = false;
  @Input({transform: (value: Columns): | Columns => value}) control?: Columns;
  @Input() selected: boolean = false;

  constructor() {
  }

  addColumn() {
    if (this.hasMaxColumns(3))
      this.control?.columns.push({container: {controls: []}})
  }

  removeColumn(index: number) {
    if (this.hasMinColumns(1))
      this.control?.columns.splice(index, 1);
  }

  hasMaxColumns(max: number): boolean {
    return this.control?.columns !== undefined && this.control?.columns.length < max;
  }

  hasMinColumns(min: number): boolean {
    return this.control?.columns !== undefined && this.control?.columns.length > min;
  }
}
