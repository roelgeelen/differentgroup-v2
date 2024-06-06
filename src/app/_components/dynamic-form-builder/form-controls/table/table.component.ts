import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import {Table} from "./table.class";
import { TableFormControlComponent } from './table-form-control.component';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
    imports: [ReactiveFormsModule, TableFormControlComponent]
})
export class TableComponent extends FormControlComponentBase<Table> implements OnInit {
  @Input() form!: FormGroup;

  constructor() {
    super()
  }

  ngOnInit(): void {

  }

}
