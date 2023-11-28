import {IFormControlOptionsChoices} from "./form-control-options-choices.interface";

export interface IFormControlOptions
{
  label?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  choices?: IFormControlOptionsChoices[];
  required?:boolean;
}
