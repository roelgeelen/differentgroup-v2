import { IFormControlOptions } from '../form-control-options.interface';
import { IFormControl } from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class RadioBtn implements IFormControl<IFormControlOptions, string> {
  readonly id: string = uuidV4();
  readonly icon: string = 'radio_button_checked';
  readonly type: string = 'RadioBtn';
  readonly title: string = 'Enkele keuze';

  constructor(public options?: IFormControlOptions, public value?: string) {
    this.options = {
      label: 'Label',
      choices: [
        {value: 'Optie 1'},
        {value: 'Optie 2'}
      ]
    }
  }
}
