import {Component, Input, OnInit} from '@angular/core';
import {FormControlComponentBase} from '../control-component-base.class';
import {Calculation} from './calculation.class';
import {FormGroup} from "@angular/forms";
import {FormService} from "../../services/form.service";
import {IFormControl} from "../form-control.interface";

@Component({
  selector: 'app-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class CalculationComponent extends FormControlComponentBase<Calculation> implements OnInit {
  @Input() form!: FormGroup;
  choiceControls: IFormControl[] = [];
  duration: number = 0;

  constructor(private formService: FormService) {
    super()
  }

  eval(calc?: string) {
    if (calc) {
      try {
        return eval(calc)
      } catch (e) {
        return 'Error';
      }
    }
  }

  ngOnInit(): void {
    if (this.control?.options?.calcDuration) {
      this.formService.formGroup$.subscribe(form => {
        this.setChoiceControls();
        this.setDuration(this.formService.formGroup$.getValue().getRawValue());
        form.valueChanges.subscribe(value => {
          this.setDuration(value)
        })
      })
    }
  }

  private setDuration(formGroup: any) {
    let duration = 0;
    for (const groupId of Object.keys(formGroup)) {
      let selectedValues = formGroup[groupId];

      // Check if selectedValue is an array
      if (!Array.isArray(selectedValues)) {
        selectedValues = [selectedValues]; // Convert to array if not already an array
      }

      const formControl = this.choiceControls.find(control => control.id === groupId);

      if (formControl) {
        selectedValues.forEach((selectedValue: any) => {
          const selectedChoice = formControl.options!.choices!.find(choice => choice.value === selectedValue);

          if (selectedChoice && selectedChoice.duration) {
            duration = duration + selectedChoice.duration;
          }
        });
      }
    }
    this.duration = duration;
  }

  setChoiceControls() {
    const formControls = this.formService.form$.getValue().pages.flatMap(page => page.controls);

    const pushControlToList = (control: IFormControl) => {
      if (control.options?.choices) {
        this.choiceControls.push(control);
      }
    };

    formControls.forEach(control => {
      if (control.type === 'Columns' && control.columns) {
        control.columns.forEach(col => {
          col.container.controls.forEach(subControl => {
            pushControlToList(subControl);
          });
        });
      } else {
        pushControlToList(control);
      }
    });
  }
}
