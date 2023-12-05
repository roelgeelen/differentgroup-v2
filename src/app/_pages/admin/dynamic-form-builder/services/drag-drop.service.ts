import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove,
  CdkDragRelease,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {IDragItem} from '../models/drag-item.interface';
import {IFormControl} from "../form-controls/form-control.interface";
import {FormControlsService} from "../form-controls/form-controls.service";
import {v4 as uuidV4} from "uuid";

@Injectable({providedIn: 'root'})
export class DragDropService {
  dropLists: CdkDropList[] = [];
  currentHoverDropListId?: string;
  controlDropped: Subject<IFormControl> = new Subject<IFormControl>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private formControlsService: FormControlsService
  ) {
  }

  public register(dropList: CdkDropList) {
    this.dropLists.push(dropList);
  }

  dragMoved(event: CdkDragMove<IFormControl>) {
    let elementFromPoint = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );

    if (!elementFromPoint) {
      this.currentHoverDropListId = undefined;
      return;
    }

    if (elementFromPoint.classList.contains('no-drop')) {
      this.currentHoverDropListId = 'no-drop';
      return;
    }

    let dropList = elementFromPoint.classList.contains('cdk-drop-list')
      ? elementFromPoint
      : elementFromPoint.closest('.cdk-drop-list');

    if (!dropList) {
      this.currentHoverDropListId = undefined;
      return;
    }

    this.currentHoverDropListId = dropList.id;
  }

  isDropAllowed(drag: CdkDrag, drop: CdkDropList) {
    if (this.currentHoverDropListId == null) {
      return true;
    }

    // Not allowed in columns
    if (drop.id == '' && drag.data.type === 'Columns') {
      return false;
    }
    console.log('drop='+drop.id)

    return drop.id === this.currentHoverDropListId;
  }

  drop(event: CdkDragDrop<IFormControl[]>) {
    if (event.previousContainer.id !== 'toolbox') {
      console.log(event.container)
      if (event.previousContainer == event.container) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }

      this.controlDropped.next(event.item.data);
    } else {
      let sourceItem = <IDragItem>event.item.data;
      let control = this.formControlsService.createControl(sourceItem.type);

      event.container.data.splice(event.currentIndex, 0, control);

      this.controlDropped.next(control);
    }
  }

  dragReleased(event: CdkDragRelease) {
    this.currentHoverDropListId = undefined;
  }
}
