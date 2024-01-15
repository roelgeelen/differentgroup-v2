import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatButtonModule} from "@angular/material/button";
import {MatSliderModule} from "@angular/material/slider";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'slider-form-control',
  template: `
      <div class="slider-box">
          <div class="slider-item">
              <button mat-mini-fab color="primary" (click)="decrement()">
                  <mat-icon>remove</mat-icon>
              </button>
              <span>{{ value }}</span>
              <button mat-mini-fab color="primary" (click)="increment()">
                  <mat-icon>add</mat-icon>
              </button>
          </div>
          <div class="slider-control">
              <mat-slider class="field" [min]="min" [max]="max" [step]="step">
                  <input matSliderThumb [(ngModel)]="value" (ngModelChange)="onValueChange()">
              </mat-slider>
          </div>
      </div>
  `,
  styleUrls: ['slider-form-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderFormControlComponent),
      multi: true,
    },
  ],
  imports: [
    MatButtonModule,
    FormsModule,
    MatSliderModule,
    MatIconModule,
    MatInputModule
  ],
  standalone: true
})
export class SliderFormControlComponent implements ControlValueAccessor {
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() step: number = 1;
  value: number =0;

  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  constructor() {
  }

  writeValue(value: any) {
    this.value = +value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  onValueChange() {
    this.onChange(this.value.toString());
    this.onTouched();
  }

  increment() {
    if (this.value < this.max) {
      this.value += this.step;
      this.onValueChange();
    }
  }

  decrement() {
    if (this.value > this.min) {
      this.value -= this.step;
      this.onValueChange();
    }
  }
}
