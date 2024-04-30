import {Component, Input} from '@angular/core';
import {IEvent} from "../../utils/event.interface";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  standalone: true,
  imports: [
    DatePipe
  ],
  styleUrl: './event-item.component.scss'
})
export class EventItemComponent {
  @Input() event!: IEvent;

  get isToday() {
    return (new Date(this.event.start.dateTime)).setHours(0,0,0,0) === (new Date()).setHours(0,0,0,0)
  }

  toInt(year: any) {
    return year
  }

  get isBirthday() {
    return this.event.categories.includes('Verjaardag')
  }
}
