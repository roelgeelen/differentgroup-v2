import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IForm} from '../models/form.interface';
import {DragDropService} from './drag-drop.service';
import {IFormControl} from "../form-controls/form-control.interface";
import {FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";

@Injectable({providedIn: 'root'})
export class FormService {
  formGroup$ = new BehaviorSubject<FormGroup>(this.toFormGroup());
  form$ = new BehaviorSubject<IForm>({
    title: 'Nieuw formulier',
    isQuotation: false,
    pages: []
  });
  selectedControl$ = new BehaviorSubject<IFormControl | null>(null);
  editForm$ = new BehaviorSubject<boolean>(false);

  constructor(private dragDropService: DragDropService) {
    this.dragDropService.controlDropped.subscribe((control) => {
      this.onControlDropped(control);
      this.formGroup$.next(this.toFormGroup())
    });
  }

  private onControlDropped(control: IFormControl) {
    this.onControlSelected(control)
  }

  public onControlSelected(control: IFormControl | null) {
    if (control != null) {
      this.editForm$.next(false);
    }

    this.selectedControl$.next(control);
  }

  public setForm(form: IForm) {
    this.form$.next(form);
    this.formGroup$.next(this.toFormGroup())
  }

  public toggleFormSettings() {
    // this.selectedControl$.next(null);
    const currentValue = this.editForm$.getValue();
    this.editForm$.next(!currentValue);
  }

  findControlById(controlId: string) {
    for (const page of this.form$.getValue().pages) {
      for (const control of page.controls) {
        if (control.id === controlId) {
          return control;
        }
        if (control.type === 'Columns' && control.columns) {
          for (const column of control.columns) {
            for (const colControl of column.container.controls) {
              if (colControl.id === controlId) {
                return colControl;
              }
            }
          }
        }
      }
    }
    return null;
  }

  toFormGroup() {
    const group: any = {};
    if (this.form$ != null) {
      this.form$.getValue().pages.forEach(page => {
        page.controls.forEach(control => {
          if (control.value !== undefined) {
            group[control.id] = this.createFormControl(control);
          }
          if (control.type === 'Columns') {
            control.columns?.forEach(col => {
              col.container.controls.forEach(c => {
                group[c.id] = this.createFormControl(control);
              })
            })

          }
        })
      })
    }
    return new FormGroup(group);
  }

  createFormControl(control: IFormControl): FormControl {
    const validators: ValidatorFn[] = [];

    if (control.options?.validators !== undefined) {
      const {required, min, max} = control.options.validators;

      if (required) {
        validators.push(Validators.required);
      }

      if (typeof min === 'number') {
        validators.push(Validators.min(min));
      }

      if (typeof max === 'number') {
        validators.push(Validators.max(max));
      }
    }

    return new FormControl(control.value || '', validators);
  }
}
