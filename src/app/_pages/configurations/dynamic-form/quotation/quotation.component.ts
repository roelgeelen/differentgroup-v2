import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {
  concatMap, delay, filter,
  forkJoin, from,
  mergeMap, of, Subscription,
  tap, timer
} from "rxjs";
import {catchError} from "rxjs/operators";

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
export class QuotationComponent implements OnInit, OnDestroy {
  quoteItems: IQuoteLine[] = [];
  fetchedProducts: IQuoteLineProduct[] = [];
  private quoteItemsSubscription: Subscription | undefined;

  constructor(
    private apiQuoteService: ApiQuoteService,
    private quoteService: QuoteService
  ) {
  }

  ngOnInit(): void {
    this.quoteItemsSubscription = this.quoteService.quoteItems$.subscribe(i => {
      setTimeout(() => {
        this.quoteItems = i;
        this.apiQuoteService.searchProducts(this.quoteItems.map(i => i.sku)).subscribe(r => this.fetchedProducts = r.results)
      });
    })
  }

  ngOnDestroy(): void {
    if (this.quoteItemsSubscription) {
      this.quoteItemsSubscription.unsubscribe();
    }
    this.quoteService.ngOnDestroy();
  }

  protected getFetchedProduct(productSku: string) {
    return this.fetchedProducts.find(product => product.properties.hs_sku === productSku);
  }

  calculateTotalPrice(): number {
    let totalPrice = 0;

    for (const quoteItem of this.quoteItems) {
      const prod = this.getFetchedProduct(quoteItem.sku);
      if (prod) {
        totalPrice += (quoteItem.amount! * parseFloat(prod.properties?.price ?? '0'));
      }
    }
    return totalPrice;
  }

}
