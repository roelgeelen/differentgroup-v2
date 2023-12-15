import { IFormControlOptions } from '../form-control-options.interface';
import { IFormControl } from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class Divider implements IFormControl<IFormControlOptions, null> {
  readonly id: string = uuidV4();
  readonly icon: string = 'drag_handle';
  readonly type: string = 'Divider';
  readonly title: string = 'Divider';

  constructor(public options?: IFormControlOptions) {
    this.options = {
      visibility: options?.visibility ?? {
        showInForm: options?.visibility?.showInForm ?? true,
        showInConfiguration: options?.visibility?.showInConfiguration ?? true
      },
    }
  }
}
