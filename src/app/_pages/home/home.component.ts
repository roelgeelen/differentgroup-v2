import { Component } from '@angular/core';
import {ApiService} from "../../_services/api.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private apiService: ApiService) {
  }

  test() {
    this.apiService.getTest().subscribe(r=> console.log(r))
  }
}
