import {Component, Input} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {IConfigChanges} from "../../../../_models/configuration/configuration-change.interface";
import {DateAgoPipe} from "../../../../_helpers/pipes/date-ago.pipe";
import {SharedModule} from "../../../../shared.module";
import {KeyValuePipe} from "@angular/common";

@Component({
  selector: 'history-item',
  template: `
      <div class="history-item">
          <div class="title">
              <span class="name">{{ item.createdBy }}</span>
              <span class="date">{{ item.createdAt|dateAgo }}</span>
          </div>
          @for (change of item.changes;track change) {
              @switch (change.fieldType) {
                  @case ('ImageUpload') {
                      <div class="bullet-item">
                          <div class="bullet"></div>
                          <div class="change-text">
                              <span class="block name full">{{ change.fieldName }}</span>
                              @if (change.oldValue) {
                                  <div class="block">
                                      <img [src]="change.oldValue.url" alt="afbeelding">
                                  </div>
                                  <mat-icon>arrow_forward</mat-icon>
                              }
                              @if (change.newValue) {
                                  <div class="block">
                                      <img class="block" [src]="change.newValue.url" alt="afbeelding">
                                  </div>
                              } @else {
                                  <mat-icon color="warn">close</mat-icon>
                              }
                          </div>
                      </div>
                  }
                  @case ('FileUpload') {
                      <div class="bullet-item">
                          <div class="bullet"></div>
                          <div class="change-text">
                              <span class="block name full">{{ change.fieldName }}</span>
                              @if (change.oldValue) {
                                  <span class="block file">{{ change.oldValue.name }}</span>
                                  <mat-icon>arrow_forward</mat-icon>
                              }
                              @if (change.newValue) {
                                  <span class="block file">{{ change.newValue.name }}</span>
                              } @else {
                                  <mat-icon color="warn">close</mat-icon>
                              }
                          </div>
                      </div>
                  }
                  @case ('TextArea') {
                      <div class="bullet-item">
                          <div class="bullet"></div>
                          <div class="change-text">
                              <span class="block name">{{ change.fieldName }}</span>
                              @if (change.oldValue) {
                                  <span class="block full" [innerHTML]="change.oldValue | safeHtml"></span>
                                  <mat-icon>arrow_downward</mat-icon>
                              }
                              <span class="block full" [innerHTML]="change.newValue | safeHtml"></span>
                          </div>
                      </div>
                  }
                  @case ('Table') {
                      <div class="bullet-item">
                          <div class="bullet"></div>
                          <div class="change-text">
                              <span class="block name full">{{ change.fieldName }}</span>
                              @if (change.oldValue) {
                                  <table class="full">
                                      @for (row of change.oldValue;track row) {
                                          <tr>
                                              @for (col of row|keyvalue;track col) {
                                                  <td>{{ col.key }}: {{ col.value }}</td>
                                              }
                                          </tr>
                                      }
                                  </table>
                                  <mat-icon>arrow_downward</mat-icon>
                              }
                              <table>
                                  @for (row of change.newValue;track row) {
                                      <tr>
                                          @for (col of row|keyvalue;track col) {
                                              <td>{{ col.key }}: {{ col.value }}</td>
                                          }
                                      </tr>
                                  }
                              </table>
                          </div>
                      </div>
                  }
                  @default {
                      <div class="bullet-item">
                          <div class="bullet"></div>
                          <div class="change-text">
                              <span class="block name">{{ change.fieldName }}</span>
                              @if (change.oldValue) {
                                  <span class="block">{{ change.oldValue }}</span>
                                  <mat-icon>arrow_forward</mat-icon>
                              }
                              <span class="block">{{ change.newValue }}</span>
                          </div>
                      </div>
                  }
              }
          }
      </div>
  `,
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    DateAgoPipe,
    SharedModule,
    KeyValuePipe
  ],
  styleUrl: './configuration-history.component.scss'
})
export class HistoryItemComponent {
  @Input() item!: IConfigChanges;

  constructor() {
  }

  protected readonly JSON = JSON;
}
