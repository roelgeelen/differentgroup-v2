import {Component, OnInit} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {NewsService} from "../../data-access/news.service";
import {map, Observable, tap} from "rxjs";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from "@angular/material/table";
import {IForm} from "../../../../_components/dynamic-form-builder/models/form.interface";
import {FormControl} from "@angular/forms";
import {IMeasureTable} from "../../../sales/utils/measureTable";
import {SalesService} from "../../../sales/data-access/sales.service";
import {format} from "date-fns";
import {IChecklistItem} from "../../../warehouse/utils/checklist-item";
import {INews} from "../../utils/news";
import {AsyncPipe} from "@angular/common";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatMenu, MatMenuItem, MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import Swal from "sweetalert2";
import {HttpEventType, HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    RouterLink,
    AsyncPipe,
    MatCell,
    MatCellDef,
    MatCheckbox,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuModule,
    MatPaginator
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
