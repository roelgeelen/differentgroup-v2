import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {SafeUrlPipe} from "../../../../_helpers/pipes/safe-url.pipe";

@Component({
  selector: 'app-configurations-old',
  templateUrl: './configurations-old.component.html',
  standalone: true,
  styleUrl: './configurations-old.component.scss',
  imports: [
    SafeUrlPipe
  ]
})
export class ConfigurationsOldComponent {
  id: string = '';

  constructor(private route: ActivatedRoute, private sanitizer:DomSanitizer) {
    this.route.paramMap.subscribe(queryParams => {
      if (queryParams.get('id') !== null) {
        this.id = queryParams.get('id')??'';
      }
    })
  }

}
