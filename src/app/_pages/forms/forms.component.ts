import {Component, OnInit} from "@angular/core";
import {FormService} from "../admin/dynamic-form-builder/services/form.service";
import {CacheService} from "../../_services/cache.service";
import {IForm} from "../admin/dynamic-form-builder/models/form.interface";
import {delay} from "rxjs";


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss'
})
export class FormsComponent implements OnInit{
  constructor(public formService: FormService, private cacheService: CacheService) {
    this.formService.setForm(null);
  }
  async ngOnInit() {
    this.formService.setForm(await this.loadForm().then(r => r));
  }

  async loadForm(): Promise<IForm> {
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
}
