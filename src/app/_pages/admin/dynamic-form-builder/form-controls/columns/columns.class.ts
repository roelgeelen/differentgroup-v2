import { IFormControl } from '../form-control.interface';
import { IColumn } from './column.interface';
import {IFormControlOptions} from "../form-control-options.interface";
import {v4 as uuidV4} from "uuid";

export class Columns implements IFormControl {
  readonly id: string = uuidV4();
  readonly icon: string = 'table_chart';
  readonly type: string = 'Columns';
  readonly title: string = 'Columns';

  columns: IColumn[] = [
    { container: { controls: [] } },
    { container: { controls: [] } },
  ];

  constructor(public options?: IFormControlOptions, public value?: string) {
    this.options = {
      label: 'Label'
    }
  }
}
