import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Observable, of} from "rxjs";
import {INews} from "../../utils/news";
import {NewsService} from "../../data-access/news.service";
import {AsyncPipe, Location} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {ImageLoaderComponent} from "../../ui/image-loader/image-loader.component";
import {MatProgressBar} from "@angular/material/progress-bar";
import Swal from "sweetalert2";

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
  id: string | null = null;
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


  constructor(private route: ActivatedRoute, private router: Router, private newsService: NewsService,private location: Location,) {
    this.editor = new Editor();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (params.get('id') !== null) {
        this.news$ = this.newsService.getNews(this.id);
      } else {
        this.news$ = of({
          title: '',
          message: '',
          published: false,
        })
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
    if (this.id) {
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
    } else {
      this.newsService.createNews(news, this.currentFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.router.navigateByUrl('/admin/news')
          }
        },
        complete: () => {
          this.currentFile = undefined;
        }
      });
    }
  }

  clearImage(news: INews) {
    if (news.image) {
      this.newsService.removeimage(news.id!).subscribe(() => {
        news.image = undefined;
        this.imageSrc = undefined;
        this.currentFile = undefined;
      })
    } else {
      this.imageSrc = undefined;
      this.currentFile = undefined;
    }
  }

  delete(news: INews) {
    Swal.fire({
      title: 'Weet je het zeker?',
      text: 'Wil je dit nieuws item verwijderen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e3785',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ja, verwijderen!',
      cancelButtonText: 'Annuleren',
    }).then((result) => {
      if (result.isConfirmed) {
        this.newsService.deleteNews(news.id!).subscribe(r => {
          if (r.type === HttpEventType.UploadProgress) {
            // @ts-ignore
            this.loading = true;
          } else if (r instanceof HttpResponse) {
            this.router.navigateByUrl('/admin/news')
          }
        })
      }
    });
  }
}
