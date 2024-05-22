import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {SafeUrlPipe} from "../../../../_helpers/pipes/safe-url.pipe";

@Component({
  selector: 'app-configurations-old',
  templateUrl: './agendas.component.html',
  standalone: true,
  styleUrl: './agendas.component.scss',
  imports: [
    SafeUrlPipe
  ]
})
export class AgendasComponent {


}
