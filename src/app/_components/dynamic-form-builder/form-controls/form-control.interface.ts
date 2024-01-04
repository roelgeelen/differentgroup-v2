import { IFormControlOptions } from "./form-control-options.interface";
import {IColumn} from "./columns/column.interface";

export interface IFormControl<TOptions = IFormControlOptions, TValue = any>
{
  readonly id: string;
  readonly icon: string;
  readonly type: string;
  readonly title: string;
  readonly category: string;
  value?: TValue;
  options?: TOptions;
  columns?: IColumn[];
}
