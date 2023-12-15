import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ApiFormService} from "../../../_services/api-form.service";
import {IForm} from "../../../_components/dynamic-form-builder/models/form.interface";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DatePipe
  ],
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit{
  forms: IForm[] | null = null;

  constructor(private apiFormService: ApiFormService) {
  }

  ngOnInit(): void {
    this.apiFormService.getForms(false).subscribe(r => this.forms = r)
  }

}
