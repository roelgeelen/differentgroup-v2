import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {ITheme, ThemeService} from "../../../../_helpers/theme.service";

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.component.html',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    RouterLink,
    FormsModule,
    MatFormField,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix
  ],
  styleUrl: './form-page.component.scss'
})
export class FormPageComponent implements OnInit{
  @Output() newName = new EventEmitter<string>();
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() prevLink: string = '';
  @Input() canEdit: boolean = false;

  theme: ITheme | null = null;
  edit = false;


  constructor(private themeService: ThemeService,) {
  }

  ngOnInit(): void {
    this.themeService.theme$.subscribe(t => this.theme = t);
  }


  save() {
    this.newName.emit(this.title);
  }
}
