import {Component, OnInit} from '@angular/core';
import {HomeService} from "../data-access/home.service";
import {Observable, of} from "rxjs";
import {IPost} from "../utils/post.interface";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {IPage} from "../../../_models/page.interface";

import {NewsCardComponent} from "../ui/news-card/news-card.component";
import {MatIcon} from "@angular/material/icon";
import {IEvent} from "../utils/event.interface";
import {EventItemComponent} from "../ui/event-item/event-item.component";
import {MatDivider} from "@angular/material/divider";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import Swal from "sweetalert2";
import {AuthService, User} from "@auth0/auth0-angular";
import {catchError} from "rxjs/operators";
import {MatError} from "@angular/material/form-field";
import {DataErrorMessageComponent} from "../../../_components/data-error-message/data-error-message.component";

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
    NewsCardComponent,
    MatIcon,
    MatCardHeader,
    EventItemComponent,
    MatDivider,
    MatCardActions,
    MatButton,
    MatError,
    MatMiniFabButton,
    DataErrorMessageComponent,
  ],
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  currentUser: User|undefined;
  posts$?: Observable<IPage<IPost[]>>;
  events$?: Observable<{value: IEvent[]}>
  postsError = false;
  eventsError = false;
  welkom: string = 'Welkom';

  constructor(private homeService: HomeService, private auth: AuthService) {
    this.getPosts();
    this.getEvents();
    this.auth.user$.subscribe(user => {
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

  getPosts() {
    this.postsError = false;
    this.posts$ = this.homeService.getPosts(0, 4).pipe(
      catchError(err => {
        this.postsError = true;
        return of();
      })
    );
  }

  getEvents() {
    this.eventsError = false;
    this.events$ = this.homeService.getEvents().pipe(
      catchError(err => {
        this.eventsError = true;
        return of();
      })
    );
  }

  betrayUser() {
    Swal.fire({
      title: 'Ik wil ' + this.currentUser!.name + ' verraden.',
      showCancelButton: true,
      imageUrl: 'assets/images/betray.png',
      imageHeight: 300,
      confirmButtonText: 'Ja, Verraden',
      confirmButtonColor: '#2e3785',
      cancelButtonText: `Nee toch niet`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.homeService.betrayUser(this.currentUser!.name!, this.currentUser!.email!).subscribe()
        Swal.fire({
          title: 'Bedankt voor je oplettendheid, ' +this.currentUser!.name + ' is je niet dankbaar.',
          icon: 'success',
          confirmButtonColor: '#2e3785',
        })
      }
    })
  }
}
