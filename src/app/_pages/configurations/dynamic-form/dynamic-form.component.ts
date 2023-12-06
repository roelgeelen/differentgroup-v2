import { Component } from '@angular/core';
import {FormService} from "../../../_components/dynamic-form-builder/services/form.service";
import {CacheService} from "../../../_services/cache.service";
import {AsyncPipe} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {
  FormContainerComponent
} from "../../../_components/dynamic-form-builder/form-container/form-container.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {FlexModule} from "@angular/flex-layout";
import {ActivatedRoute} from "@angular/router";
import {ApiFormService} from "../../../_services/form.service";

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        AsyncPipe,
        MatButtonModule,
        MatTabsModule,
        FormContainerComponent,
        MatProgressSpinnerModule,
        MatIconModule,
        FlexModule
    ],
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  tabIndex = 0;

  constructor(public formService: FormService, private route:ActivatedRoute, private apiFormService: ApiFormService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(queryParams => {
      if (queryParams.get('formId') !== null) {
        this.apiFormService.getForm(queryParams.get('formId')!).subscribe(f => this.formService.setForm(f));
      }
    });
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
