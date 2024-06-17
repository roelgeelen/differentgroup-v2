import {Component, OnInit} from '@angular/core';
import { MatCardModule} from "@angular/material/card";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-ek-pool',
  standalone: true,
    imports: [
        MatCardModule,

    ],
  templateUrl: './ek-pool.component.html',
  styleUrl: './ek-pool.component.scss'
})
export class EkPoolComponent implements OnInit{
  rankingHtml: SafeHtml = '';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.fetchRankingWidget();
  }

  fetchRankingWidget(): void {
    const url = 'https://www.ekpooltjes.nl/rankingpoolwidget/63cec7e4c16bd709c90f0149340a9d6a/123/';
    this.http.get(url, { responseType: 'text' }).subscribe(
      (response) => {
        this.rankingHtml = this.sanitizer.bypassSecurityTrustHtml(response);
      },
      (error) => {
        console.error('Error fetching ranking widget:', error);
      }
    );
  }
}
