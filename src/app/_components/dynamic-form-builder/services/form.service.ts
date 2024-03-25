import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {IForm} from '../models/form.interface';
import {DragDropService} from './drag-drop.service';
import {IFormControl} from "../form-controls/form-control.interface";
import {IColumn} from "../form-controls/columns/column.interface";

@Injectable({providedIn: 'root'})
export class FormService {
  formGroup$ = new BehaviorSubject<FormGroup>(new FormGroup({}));
  form$ = new BehaviorSubject<IForm>({
    title: 'Nieuw formulier',
    pages: [],
    options: {
      createQuotation: false,
    }
  });
  controlValueChanged$ = new BehaviorSubject<IFormControl | null>(null);
  selectedControl$ = new BehaviorSubject<IFormControl | null>(null);
  loadingForm$ = new BehaviorSubject<boolean>(false);
  _hubspotFields: { [key: string]: string } = {};

  constructor(private dragDropService: DragDropService) {
    this.dragDropService.controlDropped.subscribe((control) => {
      this.onControlDropped(control);
      this.updateFormGroup();
    });
  }

  private onControlDropped(control: IFormControl) {
    this.onControlSelected(control);
  }

  setLoadingStatus(status: boolean) {
    this.loadingForm$.next(status);
  }

  public onControlSelected(control: IFormControl | null) {
    this.selectedControl$.next(control);
  }

  public onControlValueChanged(control: IFormControl | null) {
    console.log(control)
    this.controlValueChanged$.next(control);
  }

  public getHubspotFields() {
    return this._hubspotFields;
  }

  public setForm(form: IForm | null, values?: any) {
    this.selectedControl$.next(null);
    this.form$.next(form!==null ? form : {
      title: '',
      pages: [],
      options: {}
    });
    this.updateFormGroup(values);
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

  getAvailableFields(condition:((option: IFormControl) => boolean)) {
    const fields: IFormControl[] = [];
    const formControls = this.form$.value.pages.flatMap(page => page.controls);

    const pushControlToList = (control: IFormControl) => {
      if (condition(control)) {
        fields.push(control);
      }
    };

    formControls.forEach(control => {
      if ((control.type === 'Columns' && control.columns)) {
        control.columns.forEach(col => {
          col.container.controls.forEach(subControl => {
            pushControlToList(subControl);
          });
        });
      } else {
        pushControlToList(control);
      }
    });

    return fields;
  }

  private findControlInContainer(container: any, controlId: string): IFormControl | null {
    for (const colControl of container.controls) {
      if (colControl.id === controlId) {
        return colControl;
      }
    }
    return null;
  }

  public updateFormGroup(values?: any) {
    this.formGroup$.next(this.createFormGroup(values));
  }

  private createFormGroup(values?: any): FormGroup {
    const group: { [key: string]: FormControl } = {};
    if (this.form$ != null) {
      const formValue = this.form$.value;
      if (formValue && Array.isArray(formValue.pages)) {
        formValue.pages.forEach((page) => {
          page.controls.forEach((control) => {
            if (control.value !== undefined) {
              group[control.id] = this.createFormControl(control, values);
            }
            if (control.type === 'Columns' && Array.isArray(control.columns)) {
              control.columns.forEach((col: IColumn) => {
                col.container.controls.forEach((c) => {
                  group[c.id] = this.createFormControl(c, values);
                });
              });
            }
          });
        });
      }
    }
    return new FormGroup(group);
  }

  private createFormControl(control: IFormControl, values?: any): FormControl {
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
    const value = values?.[control.id] ?? control.value ?? '';

    if (control.options?.toDeal) {
      this._hubspotFields[control.id] = control.options.toDeal;
    }

    return new FormControl(value, validators);
  }
}
