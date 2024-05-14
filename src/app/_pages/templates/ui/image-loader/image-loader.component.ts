import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {NewsService} from "../../data-access/news.service";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressSpinner
  ],
  styleUrl: './image-loader.component.scss'
})
export class ImageLoaderComponent implements OnInit {
  @Input() image!: {id: string, uuid: string, pic: Blob};
  image$?: Observable<HttpResponse<Blob>>

  constructor(private sanitizer: DomSanitizer, private newsService: NewsService) {
  }

  ngOnInit() {
      this.image$ = this.newsService.getPicture(this.image.uuid);
  }

  safeImage(picture: Blob) {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(picture));
  }
}
