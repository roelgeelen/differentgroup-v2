import { IFormPage } from "./form-container.interface";

export interface IForm
{
  title: string;
  createQuotation: boolean;
  pages: IFormPage[];
}
