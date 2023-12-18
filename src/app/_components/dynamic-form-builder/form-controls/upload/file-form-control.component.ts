import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
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
        @if (type==='image'){
          <button mat-mini-fab class="remove-image" color="warn" (click)="removeFile()">
            <mat-icon>close</mat-icon>
          </button>
          <img [src]="imageUrl?.url+'?name='+imageUrl?.name" [alt]="imageUrl?.name"/>
        } @else {
          <div class="files-list">
            <div class="single-file">
              <div class="file-icon" style="width: 40px; height: 36px">
                <img src="../../../../../assets/images/file-icon.svg" alt="icon">
              </div>
              <div class="info">
                <div class="name">
                  {{imageUrl.name}}
                </div>
              </div>
              <button mat-icon-button class="delete" color="warn" (click)="removeFile()">
                <mat-icon>delete_forever</mat-icon>
              </button>
            </div>
          </div>
        }

      } @else {
          @if (error) {
              <mat-error>Bestand is te groot. Max grote is 5MB</mat-error>
          }
          <div class="dropzone" appDnd (fileDropped)="onFileDropped($event)">
              <input type="file" id="fileDropRef" #fileInput [accept]="accept" (change)="fileBrowseHandler($event)"/>
              <ng-content></ng-content>
          </div>
      }

  `,
  styleUrls:['file-form-control.component.scss'],
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
      useExisting: forwardRef(() => FileFormControlComponent),
      multi: true
    }
  ]
})
export class FileFormControlComponent implements ControlValueAccessor {
  @Output() fileSelected = new EventEmitter<File>();
  @Input() accept: string = '*';
  @Input() type: 'image'|'file' = 'file';
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

  removeFile() {
    this.updateImageUrl(null);
  }
}
