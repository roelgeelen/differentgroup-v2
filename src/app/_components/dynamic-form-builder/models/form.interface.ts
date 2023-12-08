import { IFormPage } from "./form-container.interface";

export interface IForm
{
  id?: number;
  title: string;
  kind?: string;
  published?: boolean;
  pages: IFormPage[];
  options:IFormOptions;
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
}

export interface IFormOptions
{
  createQuotation?: boolean;
}
