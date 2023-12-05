import {Component, Input, OnInit} from '@angular/core';
import {Columns} from '../../form-controls/columns/columns.class';
import {IColumn} from "../../form-controls/columns/column.interface";

@Component({
  selector: 'app-form-columns',
  templateUrl: './form-columns.component.html',
  styleUrls: ['./form-columns.component.scss']
})
export class FormColumnsComponent implements OnInit {
  @Input() showInvisible = false;
  @Input() isBuilder = false;
  @Input() control?: Columns;
  @Input() selected: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
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
