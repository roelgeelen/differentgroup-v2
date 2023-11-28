import {Component, OnInit} from "@angular/core";
import {FormControlBase, formFields} from "./form-builder/model/form-fields";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {v4 as uuidV4} from "uuid";


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent implements OnInit{
  protected readonly formFields = formFields;
  ngOnInit(): void {
    // for testing
      formFields.reverse().forEach(f => {
        const clone = JSON.parse(JSON.stringify(f));
        clone.id = uuidV4();
        this.form_controls.splice(0, 0, clone);
      });
      formFields.reverse();
  }
  selectedField: FormControlBase|undefined;

  form_controls:any[] = [];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const clone = JSON.parse(JSON.stringify(event.previousContainer.data[event.previousIndex]));
      clone.id = uuidV4();
      event.container.data.splice(event.currentIndex, 0, clone);
      this.selectedField = clone;
    }
  }

  selectField(item: FormControlBase) {
    this.selectedField = item;
  }

  removeField(item: any) {
    this.form_controls.forEach((value,index)=>{
      if(value.id==item.id){
        this.form_controls.splice(index,1);
        this.selectedField = undefined;
      }
    });
  }

}
