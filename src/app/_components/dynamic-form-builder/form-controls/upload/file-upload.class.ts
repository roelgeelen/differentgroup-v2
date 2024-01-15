import {IFormControlOptions} from '../form-control-options.interface';
import {IFormControl} from '../form-control.interface';
import {v4 as uuidV4} from "uuid";
import {IConfigurationAttachment} from "../../../../_models/configuration/configuration.interface";

export class FileUpload implements IFormControl<IFormControlOptions, IConfigurationAttachment|null> {
  readonly id: string = uuidV4();
  readonly icon: string = 'upload_file';
  readonly type: string = 'FileUpload';
  readonly title: string = 'Bestand';
  readonly category: string = 'Velden';

  constructor(public options?: IFormControlOptions, public value?: IConfigurationAttachment|null) {
    this.value = value ?? null;
    this.options = {
      label: options?.label ?? 'Bestand',
      help: options?.help ?? '',
      note: options?.note ?? '',
      visibility: {
        intern: options?.visibility?.intern ?? true,
        extern: options?.visibility?.extern ?? true,
        customer: options?.visibility?.customer ?? true
      },
      dependent: options?.dependent ?? []
    }
  }
}
