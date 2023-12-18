import {IFormControl} from "../form-controls/form-control.interface";

export interface IFormPage
{
  id?: number;
  tab?: string;
  controls: IFormControl[];
}
