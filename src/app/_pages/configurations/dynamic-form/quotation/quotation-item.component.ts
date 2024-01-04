import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {IQuoteLine} from "../../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'quotation-item',
  template: `
      <div class="configuration-item" [class.grid]="item.product!==undefined">
          @if (item.product !== undefined) {
              <div class="item-text name">
                  <span class="sku">{{ item.sku }}</span>
                  <span class="txt">{{ item.product?.properties?.name }}</span>
              </div>
              <div class="item-text price">
                  @if (item.product?.properties?.price) {
                      <span class="txt">€ {{ item.product?.properties?.price }}</span>
                  } @else {
                      <button mat-icon-button (click)="reload(item.sku)">
                          <mat-icon color="primary">refresh</mat-icon>
                      </button>
                  }
              </div>

          } @else {
              <mat-spinner [diameter]="40"></mat-spinner>
          }
      </div>
  `,
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  styleUrl: './quotation.component.scss'
})
export class QuotationItemComponent {
  @Input() item!: IQuoteLine;
  @Output() reloadItem = new EventEmitter<string>();

  constructor() {
  }

  reload(sku: string) {
    this.item.product = undefined;
    this.reloadItem.emit(sku)
  }
}
