import { IFormControlOptions } from "./form-control-options.interface";

export interface IFormControl<TOptions = IFormControlOptions, TValue = any>
{
  readonly id: string;
  readonly icon: string;
  readonly type: string;
  readonly title: string;
  value?: TValue;
  options?: TOptions;
}
