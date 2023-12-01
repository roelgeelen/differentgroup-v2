import {Injectable} from '@angular/core';
import {IForm} from '../models/form.interface';
import {FormService} from './form.service';
import {CacheService} from "../../../../_services/cache.service";

@Injectable({providedIn: 'root'})
export class OptionsGeneratorService {
  constructor(private formService: FormService, private cacheService: CacheService) {
    this.formService.setForm(this.createDefaultOptions());
  }

  createDefaultOptions(): IForm {
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
