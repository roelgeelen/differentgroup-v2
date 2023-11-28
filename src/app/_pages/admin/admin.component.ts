import {Component} from '@angular/core';
import {v4 as uuidV4} from "uuid";
import {FormControlBase} from "../forms/form-builder/model/form-fields";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {FormService} from "./dynamic-form-builder/services/form.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  constructor(private formService: FormService) {
  }

  unSelect() {
    this.formService.onControlSelected(null);
  }
}
