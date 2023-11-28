import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TextBox} from '../form-controls/text-box/text-box.class';
import {IForm} from '../models/form.interface';
import {DragDropService} from './drag-drop.service';
import {IFormControl} from "../form-controls/form-control.interface";
import {Columns} from "../form-controls/columns/columns.class";
import {InfoBox} from "../form-controls/info-box/info-box.class";

@Injectable({providedIn: 'root'})
export class FormService {

  form$ = new BehaviorSubject<IForm>(
    {
      title: 'Nieuw formulier',
      pages: [
        {
          tab: 'Pagina 1',
          controls: [
            new InfoBox(),
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
    if (control != null){
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
}
