import {Component, OnInit} from '@angular/core';
import {HomeService} from "../data-access/home.service";
import {Observable} from "rxjs";
import {IPost} from "../utils/post.interface";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {IPage} from "../../../_models/page.interface";
import {SharedModule} from "../../../shared.module";
import {NewsCardComponent} from "../ui/news-card/news-card.component";
import {AuthenticationService} from "../../../_auth/authentication.service";
import {User} from "../../../_auth/models/User";
import {MatIcon} from "@angular/material/icon";
import {IEvent} from "../utils/event.interface";
import {EventItemComponent} from "../ui/event-item/event-item.component";
import {MatDivider} from "@angular/material/divider";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressSpinner,
    MatCard,
    MatCardTitle,
    MatCardContent,
    SharedModule,
    NewsCardComponent,
    MatIcon,
    MatCardHeader,
    EventItemComponent,
    MatDivider,
    MatCardActions,
    MatButton
  ],
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  currentUser: User|undefined;
  posts$: Observable<IPage<IPost[]>>;
  events$: Observable<IEvent[]>
  welkom: string = 'Welkom';

  constructor(private homeService: HomeService, private authService: AuthenticationService) {
    this.posts$ = this.homeService.getPosts(0, 4);
    this.events$ = this.homeService.getEvents();
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }
  ngOnInit() {
    var now = new Date().getHours();
    if (now >= 6 && now < 12) {
      this.welkom = "Goeiemorgen";
    } if(now >= 12 && now < 18) {
      this.welkom = "Goedemiddag";
    } if(now >= 18 && now < 24) {
      this.welkom = "Goeienavond";
    } if(now >= 0 && now < 6) {
      this.welkom = "Nachtwerk?";
    }
  }
}
