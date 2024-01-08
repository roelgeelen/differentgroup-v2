import {Component} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {FormService} from "../../../../_components/dynamic-form-builder/services/form.service";
import {IFormControl} from "../../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {
  IQuoteLine,
  IQuoteLineProduct
} from "../../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {QuotationItemComponent} from "./quotation-item.component";
import {ApiQuoteService} from "../../../../_services/api-quote.service";
import {isArray} from "@angular/compiler-cli/src/ngtsc/annotations/common";
import {DecimalPipe} from "@angular/common";

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
  choiceControls: IFormControl[] = [];
  quoteItems: IQuoteLine[] = [];
  fetchedSKUs: Set<string> = new Set<string>();
  fetchedProducts: IQuoteLineProduct[] = [];

  constructor(
    private formService: FormService,
    private apiQuoteService: ApiQuoteService
  ) {
    this.formService.formGroup$.subscribe(form => {
      this.setChoiceControls();
      this.setQuoteItems(this.formService.formGroup$.getValue().getRawValue());
      form.valueChanges.subscribe(value => {
        this.setQuoteItems(value)
      })
    })
  }

  async setQuoteItems(formGroup: any) {
    let selectedQuoteLines: IQuoteLine[] = [];
    const form = this.formService.form$.getValue();

    if (form.options.quoteLines) {
      selectedQuoteLines.push(...form.options.quoteLines!);
    }

    // Set size quoteline
    if (form.options.quoteSizeCalculation === 'odo' && 'width' in form.options.quoteSizeFields! && 'height' in form.options.quoteSizeFields!) {
      const width = formGroup[form.options!.quoteSizeFields['width']!.id]
      const height = formGroup[form.options!.quoteSizeFields['height']!.id]
      if (width && height) {
        const size = Math.ceil((((width < 2000 ? 2000 : width) - 2000) / 100) + 1) + (Math.ceil(((height < 2000 ? 2000 : height) - 2000) / 100) * 11)
        const sku1 = 'ODO0' + ('0' + size).slice(-2);
        const sku2 = 'ODO' + (size + 99);
        selectedQuoteLines.push(...[{sku: sku1, order: 20, product: this.findQuoteLineProductBySku(sku1)}, {
          sku: sku2,
          order: 20,
          product: this.findQuoteLineProductBySku(sku2)
        }])
      }
    }

    for (const groupId of Object.keys(formGroup)) {
      let selectedValues = formGroup[groupId];

      // Check if selectedValue is an array
      if (!Array.isArray(selectedValues)) {
        selectedValues = [selectedValues]; // Convert to array if not already an array
      }

      const formControl = this.choiceControls.find(control => control.id === groupId);

      if (formControl) {
        selectedValues.forEach((selectedValue: any) => {
          const selectedChoice = formControl.options!.choices!.find(choice => choice.value === selectedValue);

          if (selectedChoice && selectedChoice.quoteLine) {
            selectedQuoteLines.push(selectedChoice.quoteLine);
          }
        });
      }
    }

    // Filter out the already fetched SKUs
    const newSKUs = selectedQuoteLines
      .filter(quoteLine => !this.fetchedSKUs.has(quoteLine.sku))
      .map(quoteLine => quoteLine.sku);

    // Update the fetched SKUs
    newSKUs.forEach(sku => this.fetchedSKUs.add(sku));
    selectedQuoteLines.sort((a, b) => a.order - b.order || a.sku.localeCompare(b.sku));
    this.quoteItems = selectedQuoteLines;
    this.findProducts(newSKUs);
  }

  findQuoteLineProductBySku(hs_sku: string): IQuoteLineProduct | undefined {
    return this.fetchedProducts.find(product => product.properties.hs_sku === hs_sku);
  }

  async findProducts(skus: string[]) {
    for (const sku of skus) {
      const quoteLine = this.quoteItems.find(item => item.sku === sku);
      if (quoteLine) {
        await new Promise(f => setTimeout(f, 450));
        this.apiQuoteService.getProduct(sku).subscribe(r => {
          console.log("api")
          this.fetchedProducts.push(r);
          quoteLine.product = r;
        }, error => {
          quoteLine.product = null;
        })
      }
    }
  }

  async reloadItem(sku: string) {
    await this.findProducts([sku])
  }


  setChoiceControls() {
    const formControls = this.formService.form$.getValue().pages.flatMap(page => page.controls);

    const pushControlToList = (control: IFormControl) => {
      if (control.options?.choices) {
        this.choiceControls.push(control);
      }
    };

    formControls.forEach(control => {
      if (control.type === 'Columns' && control.columns) {
        control.columns.forEach(col => {
          col.container.controls.forEach(subControl => {
            pushControlToList(subControl);
          });
        });
      } else {
        pushControlToList(control);
      }
    });
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
