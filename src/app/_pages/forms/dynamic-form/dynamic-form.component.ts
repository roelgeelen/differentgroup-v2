import { Component } from '@angular/core';
import {FormService} from "../../admin/dynamic-form-builder/services/form.service";
import {CacheService} from "../../../_services/cache.service";

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  tabIndex = 0;

  constructor(public formService: FormService, private cacheService:CacheService) {
  }

  ngOnInit(): void {
    this.formService.onControlSelected(null);
  }

  get tabCount(): number {
    return this.formService.form$.getValue().pages.length;
  }

  public next() {
    window.scroll(0, 0);
    this.tabIndex = (this.tabIndex + 1) % this.tabCount;
  }

  public prev() {
    window.scroll(0, 0);
    this.tabIndex = (this.tabIndex - 1) % this.tabCount;
  }

  submit() {
    console.log(JSON.stringify(this.formService.form$.getValue()));
  }

  saveForm() {
    console.log(this.formService.formGroup$.getValue().getRawValue())
  }
}
