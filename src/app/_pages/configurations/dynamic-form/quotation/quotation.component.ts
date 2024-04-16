import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
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
import {Subscription} from "rxjs";
import {FormService} from "../../../../_components/dynamic-form-builder/services/form.service";
import {FormGroup} from "@angular/forms";

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
  @Input() btw!: number;
  quoteItems: IQuoteLine[] = [];
  fetchedProducts: IQuoteLineProduct[] = [];
  private quoteItemsSubscription: Subscription | undefined;
  private valueChangeSubscription: Subscription | undefined;

  constructor(
    private apiQuoteService: ApiQuoteService,
    private quoteService: QuoteService,
    private formService:FormService
  ) {
  }

  ngOnInit(): void {
    this.quoteItemsSubscription = this.formService.formGroup$.subscribe(formGroup => {
      this.quoteItems = this.quoteService.getQuoteItems(this.formService.form$.getValue(), formGroup.getRawValue())
      this.apiQuoteService.searchProducts(this.quoteItems.map(i => i.sku)).subscribe(r => this.fetchedProducts = r.results)
      this.valueChangeSubscription = formGroup.valueChanges.subscribe(group => {
        setTimeout(()=>{
          const newQuoteItems = this.quoteService.getQuoteItems(this.formService.form$.getValue(), group)
          const newSkus = newQuoteItems.map(i => i.sku);
          if (JSON.stringify(this.quoteItems.map(i => i.sku)) !== JSON.stringify(newSkus)){
            this.quoteItems = newQuoteItems;
            this.apiQuoteService.searchProducts(newSkus).subscribe(r => this.fetchedProducts = r.results)
          } else {
            this.quoteItems = newQuoteItems;
          }
        })
      })
    })
  }


  ngOnDestroy(): void {
    if (this.quoteItemsSubscription) {
      this.quoteItemsSubscription.unsubscribe();
    }
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
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
