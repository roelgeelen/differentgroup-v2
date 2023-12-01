import {Injectable} from '@angular/core';
import {CheckBox} from '../form-controls/check-box/check-box.class';
import {TextBox} from '../form-controls/text-box/text-box.class';
import {IForm} from '../models/form.interface';
import {FormService} from './form.service';
import {Columns} from '../form-controls/columns/columns.class';
import {InfoBox} from "../form-controls/info-box/info-box.class";
import {RadioBtn} from "../form-controls/radio-btn/radio-btn.class";
import {TextArea} from "../form-controls/text-area/text-area.class";
import {Dropdown} from "../form-controls/dropdown/dropdown.class";

@Injectable({providedIn: 'root'})
export class OptionsGeneratorService {
  constructor(private formService: FormService) {
    this.formService.setForm(this.createDefaultOptions());
  }

  createDefaultOptions(): IForm {
    return {
      title: 'Nieuw formulier',
      isQuotation: false,
      pages: [
        {
          tab: 'Pagina 1',
          controls: [
            new CheckBox({label: 'Meerkeuze veld 1'}),
            new RadioBtn({label: 'Radio veld 1', validators: {required: true}}),
            new TextBox({label: 'sadasd', type: 'number', validators: {required: true, min: 100}}),
          ]
        }
      ]
    }
  }
}
