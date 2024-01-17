import {Injectable} from '@angular/core';
import {Dropdown} from './dropdown/dropdown.class';
import {IFormControl} from './form-control.interface';
import {Slider} from './slider/slider.class';
import {CheckBox} from './check-box/check-box.class';
import {Columns} from './columns/columns.class';
import {InfoBox} from "./info-box/info-box.class";
import {RadioBtn} from "./radio-btn/radio-btn.class";
import {TextArea} from "./text-area/text-area.class";
import {Divider} from "./divider/divider.class";
import {ImageUpload} from "./upload/image-upload.class";
import {FileUpload} from "./upload/file-upload.class";
import {InfoImage} from "./info-image/info-image.class";
import {TextBox} from "./text-box/text-box.class";
import {Table} from "./table/table.class";
import {Calculation} from "./calculation/calculation.class";

@Injectable({providedIn: 'root'})
export class FormControlsService {
  controlTypes: any = {
    TextBox,
    Slider,
    TextArea,
    CheckBox,
    RadioBtn,
    Dropdown,
    Table,
    ImageUpload,
    FileUpload,
    // Overige
    InfoBox,
    InfoImage,
    Divider,
    Columns,
    Calculation
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
