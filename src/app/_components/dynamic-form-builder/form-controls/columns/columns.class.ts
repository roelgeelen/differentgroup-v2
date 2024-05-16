import {IFormControl} from '../form-control.interface';
import {IColumn} from './column.interface';
import {IFormControlOptions} from "../form-control-options.interface";
import {v4 as uuidV4} from "uuid";

export class Columns implements IFormControl {
  readonly id: string = uuidV4();
  readonly icon: string = 'table_chart';
  readonly type: string = 'Columns';
  readonly title: string = 'Columns';
  readonly category: string = 'Overige';

  columns: IColumn[] = [
    {container: {controls: []}},
    {container: {controls: []}},
  ];

  constructor(public options?: IFormControlOptions) {
    this.options = {
      label: options?.label ?? 'Label',
      help: options?.help ?? '',
      note: options?.note ?? '',
      image: options?.image ?? null,
      inApp: options?.inApp ?? false,
      visibility: {
        intern: options?.visibility?.intern ?? true,
        extern: options?.visibility?.extern ?? true,
        customer: options?.visibility?.customer ?? true
      },
      dependent: options?.dependent ?? []
    }
  }
}
