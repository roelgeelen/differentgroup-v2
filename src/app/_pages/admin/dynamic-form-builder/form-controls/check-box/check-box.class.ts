import { IFormControlOptions } from '../form-control-options.interface';
import { IFormControl } from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class CheckBox implements IFormControl<IFormControlOptions, string[]> {
  readonly id: string = uuidV4();
  readonly icon: string = 'check_box';
  readonly type: string = 'CheckBox';
  readonly title: string = 'Meerkeuze';

  constructor(public options?: IFormControlOptions, public value?: string[]) {
    this.options = {
      label: 'Label',
      choices: [
        {value: 'Optie 1'},
        {value: 'Optie 2'}
      ]
    }
  }
}
