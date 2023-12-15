import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControlComponentBase} from '../control-component-base.class';
import {ImageUpload} from './image-upload.class';
import {FormGroup} from "@angular/forms";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {ApiCustomerService} from "../../../../_services/api-customer.service";
import {ActivatedRoute} from "@angular/router";
import {ImageFormControlComponent} from "./image-form-control.component";

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent extends FormControlComponentBase<ImageUpload> implements OnInit {
  @ViewChild('imageFormControl', { static: false }) imageFormControl: ImageFormControlComponent | undefined;
  @Input() form!: FormGroup;
  dealId?: string
  configId?: string
  progress = 0;

  constructor(private apiCustomerService: ApiCustomerService, private route: ActivatedRoute) {
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
      this.apiCustomerService.upload(this.dealId, this.configId, this.control!.id, file).subscribe({
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
}
