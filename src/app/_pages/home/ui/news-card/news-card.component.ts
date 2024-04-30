import {Component, Input, OnInit} from '@angular/core';
import {IPost} from "../../utils/post.interface";
import {AsyncPipe, DatePipe} from "@angular/common";
import {HomeService} from "../../data-access/home.service";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SharedModule} from "../../../../shared.module";

@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  standalone: true,
  imports: [
    DatePipe,
    AsyncPipe,
    MatProgressSpinner,
    SharedModule
  ],
  styleUrl: './news-card.component.scss'
})
export class NewsCardComponent implements OnInit {
  @Input() post!: IPost;
  image$?: Observable<HttpResponse<Blob>>
  isExpanded = false;


  constructor(private homeService: HomeService, private sanitizer: DomSanitizer) {

  }

  ngOnInit() {
    if (this.post.image)
      this.image$ = this.homeService.getPicture(this.post.image.uuid);
  }

  safeImage(picture: Blob) {
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(picture));
  }
}
