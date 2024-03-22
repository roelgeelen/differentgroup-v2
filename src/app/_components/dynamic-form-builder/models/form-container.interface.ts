import {IFormControl} from "../form-controls/form-control.interface";
import {IFormControlOptionsDependent} from "../form-controls/form-control-options.interface";

export interface IFormPage
{
  // id?: number;
  tab?: string;
  dependent?: IFormControlOptionsDependent[];
  controls: IFormControl[];
}
