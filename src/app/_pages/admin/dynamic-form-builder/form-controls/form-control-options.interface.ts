import {IFormControlOptionsChoices} from "./form-control-options-choices.interface";
import {IFormControlOptionsDependent} from "./form-control-options-dependent.interface";

export interface IFormControlOptions {
  label?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  choices?: IFormControlOptionsChoices[];
  type?: string;
  validators?: {
    required?: boolean;
    min?: number;
    max?: number;
  };
  dependent?: IFormControlOptionsDependent[];
}
