import {Component, EventEmitter, forwardRef, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subject} from "rxjs";
import {IConfigurationAttachment} from "../../../../_models/configuration/configuration.interface";
import {DndDirective} from "../../../../_helpers/directives/dnd.directive";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'image-form-control',
  template: `
      @if (imageUrl) {
          <button mat-mini-fab class="remove-image" (click)="removeImage()">
              <mat-icon>close</mat-icon>
          </button>
          <img [src]="imageUrl?.url+'?name='+imageUrl?.name" [alt]="imageUrl?.name"/>
      } @else {
          @if (error) {
              <mat-error>Bestand is te groot. Max grote is 5MB</mat-error>
          }
          <div class="dropzone" appDnd (fileDropped)="onFileDropped($event)">
              <input type="file" id="fileDropRef" #fileInput accept="image/*" (change)="fileBrowseHandler($event)"/>
              <span>Sleep het bestand hierheen</span>
              <span>of</span>
              <label for="fileDropRef">Bestand kiezen</label>
          </div>
      }

  `,
  styleUrls:['image-form-control.component.scss'],
  standalone: true,
  imports: [
    DndDirective,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageFormControlComponent),
      multi: true
    }
  ]
})
export class ImageFormControlComponent implements ControlValueAccessor {
  @Output() fileSelected = new EventEmitter<File>();
  imageUrl: IConfigurationAttachment|null = null;
  error = false;
  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  private imageUrlSubject = new Subject<IConfigurationAttachment|null>();

  constructor() {
    this.imageUrlSubject.subscribe((url) => {
      this.imageUrl = url;
      this.onChange(this.imageUrl);
      this.onTouched();
    });
  }

  onFileDropped(event: any) {
    this.checkFile(event);
  }

  fileBrowseHandler(event: any) {
    this.checkFile(event.target.files);
  }

  checkFile(files: FileList) {
    const file = files.item(0);
    if (file !== null && file.size < 5000000) {
      this.error = false;
      this.fileSelected.emit(file);
    } else {
      this.error = true;
    }
  }

  updateImageUrl(url: IConfigurationAttachment|null) {
    this.imageUrlSubject.next(url);
  }

  writeValue(value: any) {
    this.imageUrl = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  removeImage() {
    this.updateImageUrl(null);
  }
}
