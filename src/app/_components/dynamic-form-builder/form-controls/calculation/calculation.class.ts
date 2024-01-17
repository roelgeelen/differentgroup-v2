import {IFormControlOptions} from '../form-control-options.interface';
import {IFormControl} from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class Calculation implements IFormControl<IFormControlOptions, string> {
  readonly id: string = uuidV4();
  readonly icon: string = 'calculate';
  readonly type: string = 'Calculation';
  readonly title: string = 'Berekening';
  readonly category: string = 'Overige';

  constructor(public options?: IFormControlOptions, public value?: string) {
    this.value = value ?? '';
    this.options = {
      title: options?.title ?? '',
      calcDuration: options?.calcDuration ?? false,
      visibility: {
        showInForm: options?.visibility?.showInForm ?? true,
        intern: options?.visibility?.intern ?? true,
        extern: options?.visibility?.extern ?? true,
        customer: options?.visibility?.customer ?? true
      },
      dependent: options?.dependent ?? []
    }
  }
}
