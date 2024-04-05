import {IFormControlOptions} from '../form-control-options.interface';
import {IFormControl} from '../form-control.interface';
import {v4 as uuidV4} from "uuid";
import {IConfigurationAttachment} from "../../../../_models/configuration/configuration.interface";

export class ImageUpload implements IFormControl<IFormControlOptions, IConfigurationAttachment|null> {
  readonly id: string = uuidV4();
  readonly icon: string = 'wallpaper';
  readonly type: string = 'ImageUpload';
  readonly title: string = 'Afbeelding';
  readonly category: string = 'Velden';
  constructor(public options?: IFormControlOptions, public value?: IConfigurationAttachment|null) {
    this.value = value ?? null;
    this.options = {
      label: options?.label ?? 'Afbeelding',
      help: options?.help ?? '',
      note: options?.note ?? '',
      inApp: options?.inApp ?? false,
      visibility: {
        intern: options?.visibility?.intern ?? true,
        extern: options?.visibility?.extern ?? true,
        customer: options?.visibility?.customer ?? true
      },
      dependent: options?.dependent ?? []
    }
  }
}
