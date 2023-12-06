import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {IForm} from '../models/form.interface';
import {DragDropService} from './drag-drop.service';
import {IFormControl} from "../form-controls/form-control.interface";
import {Columns} from "../form-controls/columns/columns.class";
import {IColumn} from "../form-controls/columns/column.interface";

@Injectable({providedIn: 'root'})
export class FormService {
  formGroup$ = new BehaviorSubject<FormGroup>(this.createFormGroup());
  form$ = new BehaviorSubject<IForm>({
    title: 'Nieuw formulier',
    pages: [],
    options: {
      createQuotation: false
    }
  });
  selectedControl$ = new BehaviorSubject<IFormControl | null>(null);
  editForm$ = new BehaviorSubject<boolean>(false);

  constructor(private dragDropService: DragDropService) {
    this.dragDropService.controlDropped.subscribe((control) => {
      this.onControlDropped(control);
      this.updateFormGroup();
    });
  }

  private onControlDropped(control: IFormControl) {
    this.onControlSelected(control);
  }

  public onControlSelected(control: IFormControl | null) {
    if (control !== null) {
      this.editForm$.next(false);
    }
    this.selectedControl$.next(control);
  }

  public setForm(form: IForm | null) {
    this.selectedControl$.next(null);
    this.editForm$.next(false);
    this.form$.next(form!==null ? form : {
      title: '',
      pages: [],
      options: {}
    });
    this.updateFormGroup();
  }

  public toggleFormSettings() {
    this.editForm$.next(!this.editForm$.value);
  }

  findControlById(controlId: string): IFormControl | null {
    const formValue = this.form$.value;
    if (formValue && Array.isArray(formValue.pages)) {
      for (const page of formValue.pages) {
        const foundControl = this.findControlInPage(page, controlId);
        if (foundControl) {
          return foundControl;
        }
      }
    }
    return null;
  }

  private findControlInPage(page: any, controlId: string): IFormControl | null {
    for (const control of page.controls) {
      if (control.id === controlId) {
        return control;
      }
      if (control.type === 'Columns' && Array.isArray(control.columns)) {
        for (const column of control.columns) {
          const foundControl = this.findControlInContainer(column.container, controlId);
          if (foundControl) {
            return foundControl;
          }
        }
      }
    }
    return null;
  }

  private findControlInContainer(container: any, controlId: string): IFormControl | null {
    for (const colControl of container.controls) {
      if (colControl.id === controlId) {
        return colControl;
      }
    }
    return null;
  }

  public updateFormGroup() {
    this.formGroup$.next(this.createFormGroup());
  }

  private createFormGroup(): FormGroup {
    const group: { [key: string]: FormControl } = {};
    if (this.form$ != null) {
      const formValue = this.form$.value;
      if (formValue && Array.isArray(formValue.pages)) {
        formValue.pages.forEach((page) => {
          page.controls.forEach((control) => {
            if (control.value !== undefined) {
              group[control.id] = this.createFormControl(control);
            }
            if (control.type === 'Columns' && Array.isArray(control.columns)) {
              control.columns.forEach((col: IColumn) => {
                col.container.controls.forEach((c) => {
                  group[c.id] = this.createFormControl(c);
                });
              });
            }
          });
        });
      }
    }

    return new FormGroup(group);
  }

  private createFormControl(control: IFormControl): FormControl {
    const validators: ValidatorFn[] = [];

    const optionsValidators = control.options?.validators;
    if (optionsValidators) {
      const {required, min, max} = optionsValidators;

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
