import {AfterViewInit, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {IFormControl} from "../form-control.interface";
import {FormService} from "../../services/form.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Subscription} from "rxjs";

@Component({
  selector: 'calculation-form-control',
  template: `
    <div class="calculation primary-text primary-50">
      <strong>{{ control.options?.title }}</strong> {{ value }}
    </div>
  `,
  styleUrls: ['calculation-form-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalculationFormControlComponent),
      multi: true,
    },
  ],
  imports: [
    MatProgressSpinnerModule
  ],
  standalone: true
})
export class CalculationFormControlComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() control!: IFormControl;
  @Input() form!: FormGroup;
  // @Output() change = new EventEmitter();

  valueChangeSubscription: Subscription|null=null;
  choiceControls: IFormControl[] = [];
  duration: number = 0;
  value: string = '';

  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  constructor(private formService: FormService) {
  }

  ngOnDestroy() {
    if(this.valueChangeSubscription){
      this.valueChangeSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initValue();
    this.valueChangeSubscription = this.form.valueChanges.subscribe((value) => {
      if (this.control?.options?.calcDuration) {
        this.setDuration(value);
      }
      this.onValueChange();
    });
  }

  initValue() {
    if (this.control?.options?.calcDuration) {
      this.setChoiceControls();
      this.setDuration(this.form.getRawValue());
    }
    setTimeout(()=>{
      this.onValueChange();
    })

  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private setDuration(formGroup: any): void {
    let duration = this.formService.form$.getValue().options.duration ?? 0;

    for (const groupId of Object.keys(formGroup)) {
      let selectedValues = formGroup[groupId];

      if (!Array.isArray(selectedValues)) {
        selectedValues = [selectedValues];
      }

      const formControl = this.choiceControls.find((control) => control.id === groupId);

      if (formControl) {
        selectedValues.forEach((selectedValue: any) => {
          const selectedChoice = formControl.options!.choices!.find(
            (choice) => choice.value === selectedValue
          );

          if (selectedChoice && selectedChoice.duration) {
            duration += selectedChoice.duration;
          }
        });
      }
    }
    this.duration = duration;
  }

  setChoiceControls(): void {
    const formControls = this.formService.form$.getValue().pages.flatMap((page) => page.controls);

    const pushControlToList = (control: IFormControl): void => {
      if (control.options?.choices) {
        this.choiceControls.push(control);
      }
    };

    formControls.forEach((control) => {
      if (control.type === 'Columns' && control.columns) {
        control.columns.forEach((col) => {
          col.container.controls.forEach((subControl) => {
            pushControlToList(subControl);
          });
        });
      } else {
        pushControlToList(control);
      }
    });
  }

  onValueChange(): void {
    try {
      let newValue = this.calculate(this.control.value).toString();
      if (this.control.options?.type === 'number'){
        newValue = parseInt(newValue).toString();
      }
      if (this.value !== newValue) {
        this.value = newValue;
        this.onChange(this.value);
        this.onTouched();
        this.formService.onControlValueChanged(this.control);
      }
    } catch (_) {}
  }

  calculate(calc?: string): any {
    if (calc) {
      try {
        const calculate = new Function(`return (${calc})`) as () => any;
        return calculate.call(this);
      } catch (e) {
        return 'Error';
      }
    }
  }

  getField(id: string) {
    return this.form.getRawValue()[id];
  }

}
