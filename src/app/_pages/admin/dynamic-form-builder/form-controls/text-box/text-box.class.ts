import { IFormControlOptions } from '../form-control-options.interface';
import { IFormControl } from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class TextBox implements IFormControl<IFormControlOptions, string> {
  readonly id: string = uuidV4();
  readonly icon: string = 'input';
  readonly type: string = 'TextBox';
  readonly title: string = 'Tekst veld';
  constructor(public options?: IFormControlOptions, public value?: string) {
    this.value = '';
    this.options = {
      label: 'Label',
      title: 'Titel',
      placeholder: 'Type hier...',
      type: 'text',
      validators: {
        required: false
      },
      dependent:[]
    }
  }
}
