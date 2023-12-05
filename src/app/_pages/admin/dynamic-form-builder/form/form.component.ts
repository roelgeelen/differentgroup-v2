import {Component, OnInit} from '@angular/core';
import {FormService} from '../services/form.service';
import {CacheService} from "../../../../_services/cache.service";
import {DragDropService} from "../services/drag-drop.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  tabIndex = 0;
  timeoutId = 0;
  showInvisible = true;

  constructor(public formService: FormService, private cacheService: CacheService, private dragDropService: DragDropService,) {
    var checkExist = setInterval(() => {
      var tabs = document.querySelectorAll('.mat-mdc-tab');
      if (tabs?.length == this.formService.form$.getValue().pages.length) {
        for (let i = 0; i < tabs.length; i++) {
          tabs[i].addEventListener('mouseenter', (e) => {
            this.onMouseOverTab(+(tabs[i].ariaPosInSet??'1') - 1)
          });
          tabs[i].addEventListener('mouseleave', (e) => {
            this.onMouseLeaveTab()
          });
        }
        clearInterval(checkExist);
      }
    }, 2000);
  }

  ngOnInit(): void {
  }

  get tabCount(): number {
    return this.formService.form$.getValue().pages.length;
  }

  public next() {
    window.scroll(0, 0);
    this.tabIndex = (this.tabIndex + 1) % this.tabCount;
  }

  public prev() {
    window.scroll(0, 0);
    this.tabIndex = (this.tabIndex - 1) % this.tabCount;
  }

  submit() {
    console.log(JSON.stringify(this.formService.form$.getValue()));
  }

  saveForm() {
    this.cacheService.saveData('form1', JSON.stringify(this.formService.form$.getValue()))
  }

  onMouseOverTab(tabIndex: number) {
    console.log(tabIndex)
    this.timeoutId = setTimeout(() => {
      this.tabIndex = tabIndex; // Verander de actieve tab na 2 seconden
      clearTimeout(this.timeoutId); // Wis de timeout als de muis wordt weggehaald voordat 2 seconden voorbij zijn
    }, 1200);
  }

  onMouseLeaveTab() {
    clearTimeout(this.timeoutId); // Wis de timeout als de muis wordt weggehaald voordat 2 seconden voorbij zijn
  }
}
