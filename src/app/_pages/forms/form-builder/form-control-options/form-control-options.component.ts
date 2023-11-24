import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControlBase} from "../model/form-fields";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'form-control-options',
  templateUrl: './form-control-options.component.html',
  styleUrl: './form-control-options.component.scss'
})
export class FormControlOptionsComponent {
  @Input() formField!: FormControlBase;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.formField.element.options!, event.previousIndex, event.currentIndex);
  }

  addOption() {
    this.formField.element.options?.push({value: 'Optie'})
  }

  removeOption(option: { value: string }) {
    this.formField.element.options?.forEach((opt,index)=>{
      if(opt.value==option.value){
        this.formField.element.options?.splice(index,1);
      }
    });
  }
}
