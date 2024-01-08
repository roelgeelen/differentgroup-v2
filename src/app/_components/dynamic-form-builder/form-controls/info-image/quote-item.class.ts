import {IFormControlOptions} from '../form-control-options.interface';
import {IFormControl} from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class InfoImage implements IFormControl<IFormControlOptions, null> {
  readonly id: string = uuidV4();
  readonly icon: string = 'image';
  readonly type: string = 'InfoImage';
  readonly title: string = 'Foto';
  readonly category: string = 'Overige';
  constructor(public options?: IFormControlOptions) {
    this.options = {
      image: options?.image ?? null,
      visibility: options?.visibility ?? {
        showInForm: options?.visibility?.showInForm ?? true,
        showInConfiguration: options?.visibility?.showInConfiguration ?? true
      },
      dependent: options?.dependent ?? []
    }
  }
}
