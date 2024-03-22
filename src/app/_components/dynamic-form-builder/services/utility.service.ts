import {IFormControl} from "../form-controls/form-control.interface";
import {FormService} from "./form.service";
import {Injectable} from "@angular/core";
import {IFormControlOptionsDependent} from "../form-controls/form-control-options.interface";

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private formService: FormService) {
  }

  public isShow(item: IFormControlOptionsDependent[]) {
    return item.length !== 0 ? this.isDependent(item): true;
  }

  private isDependent(item: IFormControlOptionsDependent[]) {
    let found = true;
    item.forEach((dep, index) => {
      if (dep.values.length !== 0) {
        const formGroupValue = this.formService.formGroup$.getValue().controls[dep.field];
        if (formGroupValue !== undefined) {
          if (Array.isArray(formGroupValue.value)) {
            found =
              formGroupValue.value.filter((element: string) =>
                dep.values.includes(element)
              ).length > 0;
          } else {
            found = dep.values.includes(formGroupValue.value);
          }
        } else {
          item.splice(index, 1);
        }
      }
    });
    return found;
  }
}
