import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  CdkDragRelease,
  CdkDragMove,
} from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {IFormControl} from '../../form-controls/form-control.interface';
import {IFormPage} from '../../models/form-container.interface';
import {DragDropService} from '../../services/drag-drop.service';
import {FormService} from '../../services/form.service';

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
})
export class FormContainerComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  @Input() container: IFormPage | undefined;
  @Input() showOutline = true;
  @Input() showInvisible = false;
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

  ngOnInit(): void {
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
    this.dragDropService.dragMoved(event);
  }

  public dragReleased(event: CdkDragRelease) {
    this.dragDropService.dragReleased(event);
  }

  public selectControl(item: IFormControl) {
    this.formService.onControlSelected(item);
  }

  public removeControl(controls: IFormControl[], index: number) {
    controls.splice(index, 1);
    this.formService.updateFormGroup();
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
