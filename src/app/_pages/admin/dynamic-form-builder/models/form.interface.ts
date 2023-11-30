import { IFormPage } from "./form-container.interface";

export interface IForm
{
  title: string;
  isQuotation: boolean;
  pages: IFormPage[];
}
