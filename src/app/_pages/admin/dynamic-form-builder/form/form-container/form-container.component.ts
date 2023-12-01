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
import {FormService} from "../../services/form.service";
import {isEmpty} from "rxjs";

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
})
export class FormContainerComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  @Input() container: IFormPage | undefined;
  @Input() showOutline: boolean = true;
  @Input() showInvisible: boolean = false;
  @Input() id: string = "";
  selectedControl: IFormControl | null = null;


  allowDropPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    return this.dragDropService.isDropAllowed(drag, drop);
  };

  isShow(item: IFormControl) {
    return item.options?.dependent?.length != 0 ? this.isDependent(item) : true;
  }

  public get connectedLists() {
    return this.dragDropService.dropLists;
  }

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

  dropped(event: CdkDragDrop<IFormControl[]>) {
    this.dragDropService.drop(event);
  }

  dragMoved(event: CdkDragMove<IFormControl>) {
    this.dragDropService.dragMoved(event);
  }

  dragReleased(event: CdkDragRelease) {
    this.dragDropService.dragReleased(event);
  }

  selectControl(item: IFormControl) {
    this.formService.onControlSelected(item);
  }

  removeControl(controls: IFormControl[], index: number) {
    controls.splice(index, 1);
  }

  private isDependent(item: IFormControl) {
    var found = true;
    item.options?.dependent?.forEach(dep => {
      if (dep.values.length !== 0) {
        if (Array.isArray(this.formService.formGroup$.getValue().controls[dep.field].value)) {
          found = this.formService.formGroup$.getValue().controls[dep.field].value.filter((element: string) => dep.values.includes(element)).length > 0;
        } else {
          if (!dep.values.includes(this.formService.formGroup$.getValue().controls[dep.field].value)) {
            found = false;
          }
        }
      }
    });
    return found;
  }
}
