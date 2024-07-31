import {Component, EventEmitter, Output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";

@Component({
  selector: 'data-error-message',
  standalone: true,
  imports: [
    MatIcon,
    MatMiniFabButton
  ],
  templateUrl: './data-error-message.component.html',
  styleUrl: './data-error-message.component.scss'
})
export class DataErrorMessageComponent {
  @Output() onReload: EventEmitter<any> = new EventEmitter();
}
