import {
  CdkDrag,
  CdkDragExit,
  CdkDragMove,
  CdkDragPlaceholder, CdkDragPreview,
  CdkDragRelease,
  CdkDropList
} from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import { IDragItem } from '../../../../_components/dynamic-form-builder/models/drag-item.interface';
import {FormControlsService} from "../../../../_components/dynamic-form-builder/form-controls/form-controls.service";
import {DragDropService} from "../../../../_components/dynamic-form-builder/services/drag-drop.service";
import {IFormControl} from "../../../../_components/dynamic-form-builder/form-controls/form-control.interface";

@Component({
  selector: 'app-new-controls',
  templateUrl: './new-controls.component.html',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    MatIconModule,
    CdkDragPlaceholder,
    CdkDragPreview
  ],
  styleUrl: './new-controls.component.scss'
})
export class NewControlsComponent {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  public items: IDragItem[] = [];
  public get connectedLists()
  {
    return this.dragDropService.dropLists;
  }
  constructor(private formControlsService: FormControlsService, public dragDropService: DragDropService) {}

  ngOnInit(): void {
    for (const key in this.formControlsService.controlTypes) {
      const element = this.formControlsService.controlTypes[key];

      this.items.push(new element());
    }
  }

  ngAfterViewInit(): void
  {
    if(this.dropList)
    {
      this.dragDropService.register(this.dropList);
    }
  }

  disallowDropPredicate() {
    return false;
  }

  createItemClone(event: CdkDragExit<any>) {
    this.items.splice(
      event.container._dropListRef.getItemIndex(event.item._dragRef) + 1,
      0,
      {
        ...event.item.data,
        isClone: true,
      }
    );
  }

  dragMoved(event: CdkDragMove<IFormControl>) {
    this.dragDropService.dragMoved(event);
  }

  dragReleased(event: CdkDragRelease) {
    this.dragDropService.dragReleased(event);

    this.removeItemClone();
  }

  removeItemClone() {
    this.items = this.items.filter((i) => !i.isClone);
  }
}
