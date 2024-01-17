import {Component, Input, OnInit} from '@angular/core';
import { FormControlComponentBase } from '../control-component-base.class';
import {FormGroup} from "@angular/forms";
import {Table} from "./table.class";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent extends FormControlComponentBase<Table> implements OnInit {
  @Input() form!: FormGroup;

  constructor() {
    super()
  }

  ngOnInit(): void {

  }

}
