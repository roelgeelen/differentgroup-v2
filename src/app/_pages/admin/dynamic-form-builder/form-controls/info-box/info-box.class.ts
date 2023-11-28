import { IFormControlOptions } from '../form-control-options.interface';
import { IFormControl } from '../form-control.interface';
import {v4 as uuidV4} from "uuid";

export class InfoBox implements IFormControl<IFormControlOptions, string> {
  readonly id: string = uuidV4();
  readonly icon: string = 'text_fields';
  readonly type: string = 'InfoBox';
  readonly title: string = 'Informatie';

  constructor(public options?: IFormControlOptions, public value?: string) {
    this.options = {
      title: 'Titel',
      subtitle: '<p>Lorem ipsum is een opvultekst die drukkers, zetters, grafisch ontwerpers en dergelijken gebruiken om te kijken hoe een opmaak er grafisch uitziet. De eerste woorden van de tekst luiden doorgaans</p>'
    }
  }
}
