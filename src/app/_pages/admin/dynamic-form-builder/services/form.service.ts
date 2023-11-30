import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TextBox} from '../form-controls/text-box/text-box.class';
import {IForm} from '../models/form.interface';
import {DragDropService} from './drag-drop.service';
import {IFormControl} from "../form-controls/form-control.interface";
import {Columns} from "../form-controls/columns/columns.class";
import {InfoBox} from "../form-controls/info-box/info-box.class";
import {CheckBox} from "../form-controls/check-box/check-box.class";
import {RadioBtn} from "../form-controls/radio-btn/radio-btn.class";

@Injectable({providedIn: 'root'})
export class FormService {

  form$ = new BehaviorSubject<IForm>(
    {
      title: 'Nieuw formulier',
      isQuotation: false,
      pages: [
        {
          tab: 'Pagina 1',
          controls: [
            new InfoBox(),
            new CheckBox({label: 'Meerkeuze veld 1'}),
            new RadioBtn({label: 'Radio veld 1'}),
            new TextBox(),
            new Columns()
          ]
        }
      ]
    });
  selectedControl$ = new BehaviorSubject<IFormControl | null>(null);
  editForm$ = new BehaviorSubject<boolean>(false);

  constructor(private dragDropService: DragDropService) {
    this.dragDropService.controlDropped.subscribe((control) =>
      this.onControlDropped(control)
    );
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
        // Als het controle-item van het type 'Columns' is, zoek dan binnen de kolommen
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
    // Als de control niet wordt gevonden, retourneer null
    return null;
  }

  // getFormGroup() {
  //   const group: any = {};
  //   this.form$.getValue().pages.forEach(page => {
  //     page.controls.forEach(control => {
  //       if (control.type !== 'Columns') {
  //         group[control.id] = new FormControl(control.value || '');
  //       }
  //     })
  //   })
  //   return new FormGroup(group);
  // }
}
