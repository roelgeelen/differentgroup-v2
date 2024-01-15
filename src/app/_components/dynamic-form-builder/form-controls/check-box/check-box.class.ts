import {IFormControlOptions} from '../form-control-options.interface';
import {IFormControl} from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class CheckBox implements IFormControl<IFormControlOptions, string[]> {
  readonly id: string = uuidV4();
  readonly icon: string = 'check_box';
  readonly type: string = 'CheckBox';
  readonly title: string = 'Meerkeuze';
  readonly category: string = 'Velden';
  constructor(public options?: IFormControlOptions, public value?: string[]) {
    this.value = value ?? [];
    this.options = {
      label: options?.label ?? 'Label',
      help: options?.help ?? '',
      note: options?.note ?? '',
      image: options?.image ?? null,
      customChoice: options?.customChoice ?? false,
      choices: options?.choices ?? [
        {id: uuidV4(), value: 'Optie 1'},
        {id: uuidV4(), value: 'Optie 2'}
      ],
      visibility: {
        intern: options?.visibility?.intern ?? true,
        extern: options?.visibility?.extern ?? true,
        customer: options?.visibility?.customer ?? true
      },
      dependent: options?.dependent ?? []
    };
  }
}
