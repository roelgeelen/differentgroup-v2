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
  templateUrl:'quotation-item.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  styleUrl: 'quotation-item.component.scss'
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
