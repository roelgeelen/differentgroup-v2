import {Component, OnInit} from '@angular/core';
import {FormService} from "./dynamic-form-builder/services/form.service";
import {CacheService} from "../../_services/cache.service";
import {IForm} from "./dynamic-form-builder/models/form.interface";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit{
  constructor(private formService: FormService, private cacheService: CacheService) {
    this.formService.setForm(null);
  }

  async ngOnInit() {
    this.formService.setForm(await this.createDefaultOptions().then(r => r));
  }

  async createDefaultOptions(): Promise<IForm> {
    await new Promise(f => setTimeout(f, 1000));
    const savedForm = this.cacheService.getData('form1');
    return savedForm !== null ? JSON.parse(savedForm) : {
      title: 'Nieuw formulier',
      createQuotation: false,
      pages: [
        {
          tab: 'Pagina 1',
          controls: []
        }
      ]
    }
  }

  unSelect() {
    this.formService.onControlSelected(null);
  }
}
