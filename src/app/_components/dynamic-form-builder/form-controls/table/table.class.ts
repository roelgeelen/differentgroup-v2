import {IFormControl} from "../form-control.interface";
import {IFormControlOptions} from "../form-control-options.interface";
import {v4 as uuidV4} from "uuid";

export class Table implements IFormControl<IFormControlOptions, any> {
  readonly id: string = uuidV4();
  readonly icon: string = "table";
  readonly type: string = "Table";
  readonly title: string = "Tabel";
  readonly category: string = 'Velden';
  constructor(public options?: IFormControlOptions, public value?: any) {
    this.value = value ?? [];
    this.options = {
      label: options?.label ?? 'Label',
      help: options?.help ?? '',
      note: options?.note ?? '',
      image: options?.image ?? null,
      columns: options?.columns ?? [
        {key:'Titel', type:'text'},
        {key:'Waarde', type:'text'},
      ],
      visibility: {
        intern: options?.visibility?.intern ?? true,
        extern: options?.visibility?.extern ?? true,
        customer: options?.visibility?.customer ?? true
      },
      dependent: options?.dependent ?? []
    }
  }
}
