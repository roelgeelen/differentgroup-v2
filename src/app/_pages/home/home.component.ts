import {Component} from '@angular/core';
import {ApiService} from "../../_services/api.service";
import {ApiConfigurationService} from "../../_services/api-configuration.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private apiService: ApiService) {
  }

  test() {
    console.log("Test")
  }
}
