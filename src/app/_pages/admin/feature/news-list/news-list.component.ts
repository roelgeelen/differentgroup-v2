import {Component} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import { MatButtonModule} from "@angular/material/button";
import {RouterModule} from "@angular/router";
import {NewsService} from "../../data-access/news.service";
import {map, Observable} from "rxjs";
import {
  MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {INews} from "../../utils/news";
import {AsyncPipe} from "@angular/common";
import { MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import Swal from "sweetalert2";
import {HttpEventType, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  standalone: true,
  imports: [
    MatIconModule,
    AsyncPipe,
    MatButtonModule,
    MatTableModule,
    RouterModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  styleUrls: ['./news-list.component.scss','../../../../../assets/styles/table-list.scss']
})
export class NewsListComponent {
  totalElem: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  displayedColumns: string[] = ['published', 'title', 'options', 'actions'];
  table$!: Observable<MatTableDataSource<INews>>;

  constructor(private newsService: NewsService) {
    this.getNews()
  }

  getNews() {
    this.table$ = this.newsService.getNewsList(this.pageIndex, this.pageSize).pipe(
      map(data => {
        this.totalElem = data.totalElements;
        return new MatTableDataSource<INews>(data.content)
      })
    );
  }

  onPageFired($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getNews();
  }

  delete(news:INews) {
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
            this.getNews();
          }
        })
      }
    });
  }
}
