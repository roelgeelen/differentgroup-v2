import { Component, OnInit } from '@angular/core';
import { FormService } from '../services/form.service';
import {OptionsGeneratorService} from "../services/options-generator.service";
import {CacheService} from "../../../../_services/cache.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  tabIndex = 0;
  showInvisible = true;

  constructor(public formService: FormService, public optionsGenerator: OptionsGeneratorService, private cacheService:CacheService) {
  }

  ngOnInit(): void {
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
    this.cacheService.saveData('form1', JSON.stringify(this.formService.form$.getValue()))
  }
}
