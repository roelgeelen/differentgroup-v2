import {Injectable} from '@angular/core';
import {Dropdown} from './dropdown/dropdown.class';
import {IFormControl} from './form-control.interface';
import {TextBox} from './text-box/text-box.class';
import {CheckBox} from './check-box/check-box.class';
import {Columns} from './columns/columns.class';
import {InfoBox} from "./info-box/info-box.class";
import {RadioBtn} from "./radio-btn/radio-btn.class";
import {TextArea} from "./text-area/text-area.class";
import {Divider} from "./divider/divider.class";

@Injectable({providedIn: 'root'})
export class FormControlsService {
  controlTypes: any = {
    InfoBox,
    Divider,
    TextBox,
    TextArea,
    CheckBox,
    RadioBtn,
    Dropdown,
    Columns,
  };

  constructor() {
    this.setLanguage("nl");
  }

  public createControl(type: string): IFormControl {
    return new this.controlTypes[type]();
  }

  public setLanguage(lang: string) {
  }
}
