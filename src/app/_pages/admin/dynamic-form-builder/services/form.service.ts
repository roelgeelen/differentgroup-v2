import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IForm} from '../models/form.interface';
import {DragDropService} from './drag-drop.service';
import {IFormControl} from "../form-controls/form-control.interface";
import {FormControl, FormGroup} from "@angular/forms";

@Injectable({providedIn: 'root'})
export class FormService {
  formGroup$ = new BehaviorSubject<FormGroup>(this.generateFormGroup());
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
      this.formGroup$.next(this.generateFormGroup())
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
    this.formGroup$.next(this.generateFormGroup())
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

  generateFormGroup() {
    const group: any = {};
    if (this.form$ != null) {
      this.form$.getValue().pages.forEach(page => {
        page.controls.forEach(control => {
          if (control.value !== undefined) {
            group[control.id] = new FormControl(control.value || '');
          }
          if (control.type === 'Columns') {
            control.columns?.forEach(col => {
              col.container.controls.forEach(c => {
                group[c.id] = new FormControl(c.value || '');
              })
            })

          }
        })
      })
    }
    console.log(group)
    return new FormGroup(group);
  }
}
