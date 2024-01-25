import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatButtonModule} from "@angular/material/button";
import {MatSliderModule} from "@angular/material/slider";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import { MatTableModule} from "@angular/material/table";
import {NgForOf} from "@angular/common";
import {IFormControlOptionsColumns} from "../form-control-options.interface";

@Component({
  selector: 'table-form-control',
  template: `
      <div style="overflow-x: auto">
          <table class="table w100">
              @for (row of data;track row;let idx = $index) {
                  <tr class="row">
                      @for (col of columns;track col;let colLast = $last) {
                          <td>
                              <mat-form-field class="form-input">
                                  <mat-label>{{ col.key }}</mat-label>
                                  <input matInput [(ngModel)]="row[col.key]" [placeholder]="col.key" [type]="col.type"
                                         [ngModelOptions]="{standalone: true}" (focusout)="onValueChange()"/>
                              </mat-form-field>
                          </td>
                          @if (colLast) {
                              <td style="width: 48px">
                                  <button mat-icon-button color="primary" (click)="removeFromList(idx)">
                                      <mat-icon>delete</mat-icon>
                                  </button>
                              </td>
                          }
                      }
                  </tr>
              }

          </table>
      </div>
      <button mat-stroked-button color="primary" class="w100" (click)="addRow()">
          <mat-icon>add</mat-icon>
      </button>
  `,
  styleUrls: ['table-form-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TableFormControlComponent),
      multi: true,
    },
  ],
  imports: [
    MatButtonModule,
    FormsModule,
    MatSliderModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    NgForOf
  ],
  standalone: true
})
export class TableFormControlComponent implements ControlValueAccessor {
  @Input() columns: IFormControlOptionsColumns[] = [];
  data: any[] = [];

  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  constructor() {
  }
  writeValue(value: any) {
    this.data = JSON.parse(JSON.stringify(value)) || [];
    if (this.data.length<1){
      this.addRow()
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  onValueChange() {
    this.onChange(this.data);
    this.onTouched();
  }
  addRow() {
    this.data.push({});
  }

  removeFromList(index: number) {
    this.data.splice(index, 1);
  }
}
