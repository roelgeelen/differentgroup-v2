import {Injectable} from '@angular/core';
import {ApiQuoteService} from "../../../../_services/api-quote.service";
import Swal from "sweetalert2";
import {BehaviorSubject, Subject, Subscription, takeUntil} from "rxjs";
import {
  IQuoteLine,
  IQuoteLineProduct
} from "../../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {IFormControl} from "../../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {FormService} from "../../../../_components/dynamic-form-builder/services/form.service";

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private destroy$ = new Subject<void>();
  quoteItems$ = new BehaviorSubject<IQuoteLine[]>([]);
  choiceControls: IFormControl[] = [];

  constructor(private formService: FormService) {}

  onInit() {
    this.formService.formGroup$.pipe(takeUntil(this.destroy$)).subscribe(form => {
      console.log("form")
      this.setChoiceControls();
      this.setQuoteItems(this.formService.formGroup$.getValue().getRawValue());
      form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
        console.log("value1")
        this.setQuoteItems(value)
      });
    })
  }

  onDestroy() {
    console.log('destroy quote')
    this.destroy$.next();
    this.destroy$.complete();
  }


  getSkuList() {
    return this.quoteItems$.getValue().map(i => i.sku);
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
        selectedQuoteLines.push(...[
          {sku: sku1, order: 20},
          {sku: sku2, order: 20}
        ])
      }
    }

    if (form.options.quoteSizeCalculation === 'sdh' && 'sizeTable' in form.options.quoteSizeFields!) {
      const table = formGroup[form.options!.quoteSizeFields['sizeTable']!.id]
      for (const row of table) {
        let size = (Math.ceil(row['Breedte'] / 500) * 500 - 2500) / 500 * 2 + 1;
        if (!isNaN(size)) {
          size = size < 1 ? 1 : size;
          if (row['Hoogte'] > 2500) {
            size++;
          }
          const sku1 = 'SDH' + (size + 100);
          const sku2 = 'SDH0' + ('0' + size).slice(-2);
          selectedQuoteLines.push(...[
            {sku: sku1, order: 100},
            {sku: sku2, order: 100}
          ])
        }
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
    selectedQuoteLines.sort((a, b) => a.order - b.order || a.sku.localeCompare(b.sku));
    this.quoteItems$.next(selectedQuoteLines)
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
}
