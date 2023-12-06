import {IFormControl} from "../form-controls/form-control.interface";

export interface IFormPage
{
  tab?: string;
  controls: IFormControl[];
}
