import {IFormPage} from "./form-container.interface";
import {IQuoteLine} from "../form-controls/form-control-options.interface";
import {IFormControl} from "../form-controls/form-control.interface";

export interface IForm {
  id?: number;
  title: string;
  kind?: string;
  published?: boolean;
  pages: IFormPage[];
  options: IFormOptions;
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
}

export interface IFormOptions {
  model3D?: boolean;
  roles?: string[];
  duration?: number;
  createQuotation?: boolean;
  quotePanelOpen?: boolean;
  published?: boolean;
  quoteLines?: IQuoteLine[];
  quoteSizeCalculation?: 'odo' | 'sdh' | 'zsdh' | 'old';
  quoteSizeFields?: { [key: string]: IFormControl | null };
}
