import { IFormPage } from "./form-container.interface";

export interface IForm
{
  id?: number;
  title: string;
  kind?: string;
  pages: IFormPage[];
  options:IFormOptions;
}

export interface IFormOptions
{
  createQuotation?: boolean;
}
