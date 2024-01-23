import {IFormControlOptions} from '../form-control-options.interface';
import {IFormControl} from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class Slider implements IFormControl<IFormControlOptions, string> {
  readonly id: string = uuidV4();
  readonly icon: string = 'linear_scale';
  readonly type: string = 'Slider';
  readonly title: string = 'Slider';
  readonly category: string = 'Velden';

  constructor(public options?: IFormControlOptions, public value?: string) {
    this.value = value ??'0';
    this.options = {
      label: options?.label ?? 'Label',
      help: options?.help ?? '',
      note: options?.note ?? '',
      image: options?.image ?? null,
      steps: options?.steps ?? 1,
      type: 'number',
      toDeal: options?.toDeal ?? '',
      validators: options?.validators ?? {
        required: options?.validators?.required ?? false,
        min: options?.validators?.min ?? 0,
        max: options?.validators?.max ?? 100
      },
      visibility: {
        intern: options?.visibility?.intern ?? true,
        extern: options?.visibility?.extern ?? true,
        customer: options?.visibility?.customer ?? true
      },
      dependent: options?.dependent ?? []
    }
  }
}
