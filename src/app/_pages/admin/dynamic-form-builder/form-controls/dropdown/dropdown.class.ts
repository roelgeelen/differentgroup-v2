import {IFormControl} from "../form-control.interface";
import {IFormControlOptions} from "../form-control-options.interface";
import {v4 as uuidV4} from "uuid";

export class Dropdown implements IFormControl<IFormControlOptions, string> {
  readonly id: string = uuidV4();
  readonly icon: string = "arrow_downward";
  readonly type: string = "Dropdown";
  readonly title: string = "Dropdown";

  constructor(public options?: IFormControlOptions, public value?: string) {
    this.value = '';
    this.options = {
      label: options?.label ?? 'Label',
      title: options?.title ?? 'Titel',
      choices: options?.choices ?? [
        {value: 'Optie 1'},
        {value: 'Optie 2'}
      ],
      validators: options?.validators ?? {
        required: false
      },
      dependent:[]
    }
  }
}
