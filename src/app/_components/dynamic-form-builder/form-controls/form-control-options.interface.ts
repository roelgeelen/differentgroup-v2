import {IForm} from "../models/form.interface";
export const inputTypes: { value: string, name: string }[] = [
  {value: 'text', name: 'Tekst'},
  {value: 'number', name: 'Nummer'},
  {value: 'date', name: 'Datum'},
  {value: 'datetime-local', name: 'Datum tijd'},
  {value: 'email', name: 'Email'},
  {value: 'month', name: 'Maand'},
  {value: 'tel', name: 'Telefoon'},
  {value: 'time', name: 'Tijd'},
  {value: 'url', name: 'Url'},
  {value: 'week', name: 'Week'}
]
export interface IFormControlOptions {
  label?: string;
  note?: string;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  help?: string;
  image?: IFormAttachment | null;
  customChoice?: boolean;
  calcDuration?:boolean;
  columns?: IFormControlOptionsColumns[];
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

export interface IFormControlOptionsColumns {
  key: string;
  type: string;
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
