import {IFormControlOptions} from '../form-control-options.interface';
import {IFormControl} from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class InfoBox implements IFormControl<IFormControlOptions, null> {
  readonly id: string = uuidV4();
  readonly icon: string = 'text_fields';
  readonly type: string = 'InfoBox';
  readonly title: string = 'Informatie';
  readonly category: string = 'Overige';
  constructor(public options?: IFormControlOptions) {
    this.options = {
      title: options?.title ?? 'Titel',
      subtitle: options?.subtitle ?? '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ut metus ut libero finibus tristique. Donec dictum efficitur blandit. Aliquam laoreet risus mi, et lobortis augue vestibulum a. Praesent posuere interdum tortor eget hendrerit</p>',
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
