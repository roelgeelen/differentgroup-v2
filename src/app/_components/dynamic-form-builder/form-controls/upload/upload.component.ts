import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControlComponentBase} from '../control-component-base.class';
import {ImageUpload} from './image-upload.class';
import {FormGroup} from "@angular/forms";
import {HttpClient, HttpEventType, HttpResponse} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {FileFormControlComponent} from "./file-form-control.component";
import {IFormAttachment} from "../form-control-options.interface";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent extends FormControlComponentBase<ImageUpload> implements OnInit {
  @ViewChild('imageFormControl', { static: false }) imageFormControl: FileFormControlComponent | undefined;
  @Input() form!: FormGroup;
  dealId?: string
  configId?: string
  progress = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    super();

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(queryParams => {
      if (queryParams.get('configId') !== null) {
        this.dealId = queryParams.get('dealId')!;
        this.configId = queryParams.get('configId')!;
      }
    });
  }
  handleFile(file: File) {
    if (this.dealId && this.configId) {
      this.upload(this.dealId, this.configId, this.control!.id, file).subscribe({
        next: (data: any) => {
          if (data.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * data.loaded) / data.total);
          } else if (data instanceof HttpResponse) {
            this.imageFormControl!.updateImageUrl(data.body);
            this.progress = 0;
          }
        },
        error: (e) => {
          console.log(e);
        }
      });
    }
  }


  upload(id: string, configId: string, field: string, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<IFormAttachment>(`${environment.apiLocal}/v2/customer/${id}/configurations/${configId}/fields/${field}/attachments`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
