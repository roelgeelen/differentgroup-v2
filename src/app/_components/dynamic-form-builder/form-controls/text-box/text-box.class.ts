import {IFormControlOptions} from '../form-control-options.interface';
import {IFormControl} from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class TextBox implements IFormControl<IFormControlOptions, string> {
  readonly id: string = uuidV4();
  readonly icon: string = 'input';
  readonly type: string = 'TextBox';
  readonly title: string = 'Tekst veld';
  readonly category: string = 'Velden';
  constructor(public options?: IFormControlOptions, public value?: string) {
    this.value = value ?? '';
    this.options = {
      label: options?.label ?? 'Label',
      help: options?.help ?? '',
      note: options?.note ?? '',
      image: options?.image ?? null,
      title: options?.title ?? 'Titel',
      placeholder: options?.placeholder ?? 'Type hier...',
      type: options?.type ?? 'text',
      toDeal: options?.toDeal ?? '',
      inApp: options?.inApp ?? false,
      validators: options?.validators ?? {
        required: options?.validators?.required ?? false
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
