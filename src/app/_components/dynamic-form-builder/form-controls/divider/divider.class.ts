import { IFormControlOptions } from '../form-control-options.interface';
import { IFormControl } from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class Divider implements IFormControl<IFormControlOptions, null> {
  readonly id: string = uuidV4();
  readonly icon: string = 'drag_handle';
  readonly type: string = 'Divider';
  readonly title: string = 'Divider';
  readonly category: string = 'Overige';
  constructor(public options?: IFormControlOptions) {
    this.options = {
      visibility: {
        showInForm: options?.visibility?.showInForm ?? true,
        intern: options?.visibility?.intern ?? true,
        extern: options?.visibility?.extern ?? true,
        customer: options?.visibility?.customer ?? true
      },
    }
  }
}
