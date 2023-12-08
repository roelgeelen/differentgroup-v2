import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  CdkDragRelease,
  CdkDragMove
} from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {IFormPage} from '../../models/form-container.interface';
import {DragDropService} from '../../services/drag-drop.service';
import {FormService} from '../../services/form.service';
import {IFormControl} from "../../form-controls/form-control.interface";
import Swal from "sweetalert2";

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss']
})
export class FormContainerComponent implements AfterViewInit {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  @Input() container: IFormPage | undefined;
  @Input() showOutline = true;
  @Input() showInvisible = false;
  @Input() isBuilder = false;
  @Input() id = '';
  selectedControl: IFormControl | null = null;

  constructor(
    public dragDropService: DragDropService,
    public formService: FormService
  ) {
    this.formService.selectedControl$.subscribe((control) =>
      this.selectedControl = control
    );
  }

  ngAfterViewInit(): void {
    if (this.dropList) {
      this.dragDropService.register(this.dropList);
    }
  }

  public get connectedLists() {
    return this.dragDropService.dropLists;
  }

  public allowDropPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    return this.dragDropService.isDropAllowed(drag, drop);
  };

  public isShow(item: IFormControl) {
    return (
      item.options?.dependent?.length !== 0 ? this.isDependent(item) : true
    );
  }

  public dropped(event: CdkDragDrop<IFormControl[]>) {
    this.dragDropService.drop(event);
  }

  public dragMoved(event: CdkDragMove<IFormControl>) {
    // @ts-ignore
    console.log(event.source.dropContainer.id);
    this.dragDropService.dragMoved(event);
  }

  public dragReleased(event: CdkDragRelease) {
    this.dragDropService.dragReleased(event);
  }

  public selectControl(item: IFormControl) {
    this.formService.onControlSelected(item);
  }

  public removeControl(controls: IFormControl[], index: number) {
    Swal.fire({
      title: 'Weet je het zeker?',
      text: 'Wil je deze vraag verwijderen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e3785',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ja, verwijderen!',
      cancelButtonText: 'Annuleren',
    }).then((result) => {
      if (result.isConfirmed) {
        controls.splice(index, 1);
        this.formService.updateFormGroup();
      }
    });

  }

  private isDependent(item: IFormControl) {
    let found = true;
    item.options?.dependent?.forEach((dep, index) => {
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
          item.options?.dependent?.splice(index, 1);
        }
      }
    });
    return found;
  }
}
