import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Observable, tap} from "rxjs";
import {INews} from "../../utils/news";
import {NewsService} from "../../data-access/news.service";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {ImageLoaderComponent} from "../../ui/image-loader/image-loader.component";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-news-edit',
  templateUrl: './news-edit.component.html',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    RouterLink,
    AsyncPipe,
    MatProgressSpinner,
    MatSlideToggle,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInput,
    NgxEditorModule,
    MatIconButton,
    MatMiniFabButton,
    ImageLoaderComponent,
    MatProgressBar
  ],
  styleUrl: './news-edit.component.scss'
})
export class NewsEditComponent implements OnInit {
  news$!: Observable<INews>;
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  progress = 0;
  currentFile?: File;
  message = '';
  imageSrc?: string;


  constructor(private route: ActivatedRoute, private newsService: NewsService) {
    this.editor = new Editor();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('id') !== null) {
        this.news$ = this.newsService.getNews(params.get('id'));
      }
    })
  }

  selectFile(event: any): void {
    this.progress = 0;
    this.message = '';

    if (event.target.files.item(0).size > 5000000) {
      this.message = 'Afbeelding is te groot. Max grote is 5mb';
    } else {
      this.currentFile = event.target.files.item(0);
      const reader = new FileReader();

      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageSrc = reader.result as string;
        };
      }
    }

  }

  upload(news: INews) {

    this.newsService.updateNews(news, this.currentFile).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
        }
      },
      error: (err: any) => {
        if (err.error && err.error.message) {
          this.message = err.error.message;
        } else {
          this.message = 'Could not upload the file!';
        }

        this.currentFile = undefined;
        this.progress = 0;
      },
      complete: () => {
        this.currentFile = undefined;
      }
    });

  }

  // save() {
  //   this.uploading = true;
  //   this.progress.percentage = 0;
  //   var file = this.selectedFiles?.item(0) ? this.selectedFiles?.item(0) : null;
  //   if (this.queryParam) {
  //     // @ts-ignore
  //     this.apiService.updatePost(this.post, file).subscribe(r => {
  //       if (r.type === HttpEventType.UploadProgress) {
  //         // @ts-ignore
  //         this.progress.percentage = Math.round(100 * r.loaded / r.total);
  //       } else if (r instanceof HttpResponse) {
  //         this.uploading = false
  //         this.sendNotification(this.post.published);
  //       }
  //     })
  //   } else {
  //     // @ts-ignore
  //     this.apiService.savePost(this.post, file).subscribe(r => {
  //       if (r.type === HttpEventType.UploadProgress) {
  //         // @ts-ignore
  //         this.progress.percentage = Math.round(100 * r.loaded / r.total);
  //       } else if (r instanceof HttpResponse) {
  //         this.post = new Post();
  //         this.imageSrc = '';
  //         this.uploading = false
  //         this.sendNotification(this.post.published);
  //         this.router.navigateByUrl('/admin/nieuws')
  //       }
  //     })
  //   }
  // }
  clearImage(news: INews) {
    news.image = undefined;
    this.imageSrc = undefined;

  }
}
