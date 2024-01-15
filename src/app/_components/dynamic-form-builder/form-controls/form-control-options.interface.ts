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
  steps?: number;
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
  product?: IQuoteLineProduct | null;
  sku: string;
  order: number;
}

export interface IQuoteLineProduct {
  id: string,
  properties: { name: string, description: string, price: string, hs_sku: string }
}

export interface IFormControlOptionsDependent {
  field: string;
  values: string[]
}

export interface IFormControlOptionsVisibility {
  intern: boolean;
  extern: boolean;
  customer: boolean;
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
