import {IFormControl} from "../form-control.interface";
import {IFormControlOptions} from "../form-control-options.interface";
import {v4 as uuidV4} from "uuid";

export class Dropdown implements IFormControl<IFormControlOptions, string> {
  readonly id: string = uuidV4();
  readonly icon: string = "arrow_downward";
  readonly type: string = "Dropdown";
  readonly title: string = "Dropdown";
  readonly category: string = 'Velden';
  constructor(public options?: IFormControlOptions, public value?: string) {
    this.value = value ?? '';
    this.options = {
      label: options?.label ?? 'Label',
      help: options?.help ?? '',
      note: options?.note ?? '',
      image: options?.image ?? null,
      title: options?.title ?? 'Titel',
      toDeal: options?.toDeal ?? '',
      choices: options?.choices ?? [
        {id: uuidV4(), value: 'Optie 1'},
        {id: uuidV4(), value: 'Optie 2'}
      ],
      validators: {
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
