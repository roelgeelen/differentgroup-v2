import {Component, OnInit} from '@angular/core';
import {SafeUrlPipe} from "../../../../_helpers/pipes/safe-url.pipe";

@Component({
  selector: 'app-configurations-old',
  templateUrl: './employees.component.html',
  standalone: true,
  styleUrl: './employees.component.scss',
  imports: [
    SafeUrlPipe
  ]
})
export class EmployeesComponent {


}
