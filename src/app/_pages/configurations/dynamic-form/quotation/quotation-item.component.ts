import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {
  IQuoteLine,
  IQuoteLineProduct
} from "../../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'quotation-item',
  template: `
    <div class="configuration-item grid">
      <div class="item-text name">
        <span class="sku">{{ item.sku }}</span>
        <span class="txt">{{ product?.properties?.name }}</span>
      </div>
      <div class="item-text price">
        <span class="amount">{{ item.amount || '1' }} st.</span>
        @if (product) {
          <span class="txt">€ {{ calcPrice() }}</span>
        } @else {
          <span><mat-spinner [diameter]="30"></mat-spinner></span>
        }
      </div>
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
  @Input() product?: IQuoteLineProduct | null = null;

  constructor() {
  }

  calcPrice() {
    return (this.item.amount! * parseFloat(this.product?.properties?.price??'0'))
  }
}
