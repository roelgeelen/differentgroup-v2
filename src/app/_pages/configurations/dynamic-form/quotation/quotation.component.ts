import {Component} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {
  IQuoteLine,
  IQuoteLineProduct
} from "../../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {QuotationItemComponent} from "./quotation-item.component";
import {ApiQuoteService} from "../../../../_services/api-quote.service";
import {DecimalPipe} from "@angular/common";
import {QuoteService} from "./quote.service";

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    QuotationItemComponent,
    DecimalPipe
  ],
  styleUrl: './quotation.component.scss'
})
export class QuotationComponent {
  quoteItems: IQuoteLine[] = [];
  fetchedProducts: IQuoteLineProduct[] = [];

  constructor(
    private apiQuoteService: ApiQuoteService,
    private quoteService: QuoteService
  ) {
    this.quoteService.quoteItems$.subscribe(q => {
      this.quoteItems = q;
      this.setQuoteProducts()
    });
  }

  async setQuoteProducts() {
    for (const i of this.quoteItems) {
      await this.findProduct(i);
    }
  }

  async findProduct(item: IQuoteLine) {
    let product = this.findQuoteLineProductBySku(item.sku);
    if (product) {
      item.product = product
    } else {
      await new Promise(f => setTimeout(f, 600));

      this.apiQuoteService.getProduct(item.sku).subscribe({
        next: (r) => {
          this.fetchedProducts.push(r);
          item.product = r;
        },
        error: (_) => {
          item.product = null;
        },
      })
    }
  }

  findQuoteLineProductBySku(hs_sku: string): IQuoteLineProduct | null | undefined {
    return this.fetchedProducts.find(product => product.properties.hs_sku === hs_sku);
  }


  async reloadItem(item: IQuoteLine) {
    await this.findProduct(item);
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    for (const quoteItem of this.quoteItems) {
      if (quoteItem.product && quoteItem.product.properties && quoteItem.product.properties.price) {
        totalPrice += parseFloat(quoteItem.product.properties.price);
      }
    }
    return totalPrice;
  }

}
