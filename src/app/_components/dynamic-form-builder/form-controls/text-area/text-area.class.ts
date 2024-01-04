import {IFormControlOptions} from '../form-control-options.interface';
import {IFormControl} from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class TextArea implements IFormControl<IFormControlOptions, string> {
  readonly id: string = uuidV4();
  readonly icon: string = 'notes';
  readonly type: string = 'TextArea';
  readonly title: string = 'Textarea';
  readonly category: string = 'Velden';
  constructor(public options?: IFormControlOptions, public value?: string) {
    this.value = '';
    this.options = {
      label: options?.label ?? 'Label',
      help: options?.help ?? '',
      note: options?.note ?? '',
      image: options?.image ?? null,
      placeholder: options?.placeholder ?? 'Type hier je tekst...',
      visibility: options?.visibility ?? {
        showInConfiguration: options?.visibility?.showInConfiguration ?? true
      },
      dependent: options?.dependent ?? []
    }
  }
}
