import {Component, Input} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {IConfigChanges} from "../../utils/configuration-change.interface";
import {DateAgoPipe} from "../../../../_helpers/pipes/date-ago.pipe";

import {KeyValuePipe} from "@angular/common";
import {SafeHtmlPipe} from "../../../../_helpers/pipes/safe-html.pipe";

@Component({
  selector: 'history-item',
  templateUrl: 'history-item.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    DateAgoPipe,
    KeyValuePipe,
    SafeHtmlPipe
  ],
  styleUrl: 'history-item.component.scss'
})
export class HistoryItemComponent {
  @Input() item!: IConfigChanges;

  constructor() {
  }
}
