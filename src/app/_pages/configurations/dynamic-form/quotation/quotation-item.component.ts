import {Component, Input, OnInit} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {IQuoteLine} from "../../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {ApiQuoteService} from "../../../../_services/api-quote.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'quotation-item',
  template: `
    @defer (when product) {
      <div class="configuration-item">
        <div class="item-text name">
          <span class="sku">{{item.sku}}</span>
          <span class="txt">{{ product?.properties?.name }}</span>
        </div>
        <div class="item-text price">
          <span class="txt">€ {{ product?.properties?.price }},00</span>
        </div>
      </div>
    } @placeholder {
      <mat-spinner [diameter]="40"></mat-spinner>
    }
  `,
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  styleUrl: './quotation.component.scss'
})
export class QuotationItemComponent implements OnInit{
  @Input() item!: IQuoteLine;

  product: { id: string, properties:{name: string, description: string, price: string} }|null = null;

  constructor(
    private apiQuoteService: ApiQuoteService
  ) {
  }

  ngOnInit(): void {

    this.apiQuoteService.findProduct(this.item.sku).subscribe(p => {
      this.product = p;
    });
  }


}
