import {ICustomer} from "../../../_models/configuration/customer.interface";
import {IForm} from "../models/form.interface";
import {IConfigurationItem} from "../../../_models/configuration/configuration.interface";

export interface IFormControlOptions {
  label?: string;
  note?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  help?: string;
  image?: IFormAttachment | null;
  customChoice?: boolean;
  choices?: IFormControlOptionsChoices[];
  type?: string;
  validators?: {
    required?: boolean;
    min?: number;
    max?: number;
  };
  visibility?: IFormControlOptionsVisibility;
  dependent?: IFormControlOptionsDependent[];
}

export interface IFormControlOptionsChoices {
  id: string;
  value: string;
  quoteLine?: IQuoteLine;
  duration?: number;
}

export interface IQuoteLine {
  sku: string;
  order: number;
}

export interface IFormControlOptionsDependent {
  field: string;
  values: string[]
}

export interface IFormControlOptionsVisibility {
  showInConfiguration: boolean;
  showInForm?: boolean;
}

export interface IFormAttachment {
  id: string;
  form?: IForm;
  external?: string;
  field?: string;
  name?: string;
  type?: string;
  url?: string;
}
