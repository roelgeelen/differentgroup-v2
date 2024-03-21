import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {ApiQuoteService} from "../../../../_services/api-quote.service";
import Swal from "sweetalert2";
import {BehaviorSubject, Subscription, switchMap, take} from "rxjs";
import {
  IQuoteLine,
  IQuoteLineProduct
} from "../../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {IFormControl} from "../../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {FormService} from "../../../../_components/dynamic-form-builder/services/form.service";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class QuoteService{
  quoteItems$ = new BehaviorSubject<IQuoteLine[]>([]);
  choiceControls: IFormControl[] = [];
  formGroupSubscription: Subscription | undefined;

  constructor(private formService: FormService) {
    this.formGroupSubscription = this.formService.formGroup$.pipe(
      switchMap((form: FormGroup) => {
        this.setChoiceControls();
        this.setQuoteItems(this.formService.formGroup$.getValue().getRawValue())
        return form.valueChanges;
      })
    ).subscribe(value => {
      this.setQuoteItems(value);
    });
  }

  ngOnDestroy() {
    if (this.formGroupSubscription) {
      this.formGroupSubscription.unsubscribe();
    }
  }

  getSkuList() {
    return this.quoteItems$.getValue();
  }

  async setQuoteItems(formGroup: any) {
    let selectedQuoteLines: IQuoteLine[] = [];
    const form = this.formService.form$.getValue();

    if (form.options.quoteLines)
      selectedQuoteLines.push(...form.options.quoteLines!);

    const fields = form.options.quoteSizeFields!;

    if (form.options.quoteSizeCalculation === 'odo' && 'width' in fields && 'height' in fields)
      this.calculateODOSize(formGroup, selectedQuoteLines, fields);

    if (form.options.quoteSizeCalculation === 'sdh' && 'sizeTable' in fields)
      this.calculateSDHSize(formGroup, selectedQuoteLines, fields);

    for (const groupId of Object.keys(formGroup)) {
      const selectedValues = Array.isArray(formGroup[groupId]) ? formGroup[groupId] : [formGroup[groupId]];
      const formControl = this.choiceControls.find(control => control.id === groupId);

      if (formControl)
        selectedValues.forEach((selectedValue: any) => {
          const selectedChoice = formControl.options?.choices?.find(choice => choice.value === selectedValue);
          if (selectedChoice && selectedChoice.quoteLine)
            selectedQuoteLines.push(selectedChoice.quoteLine);
        });
    }

    selectedQuoteLines = this.combineQuoteLines(selectedQuoteLines);
    selectedQuoteLines.sort((a, b) => a.order - b.order || a.sku.localeCompare(b.sku));
    this.quoteItems$.next(selectedQuoteLines);
  }

  calculateODOSize(formGroup: any, selectedQuoteLines: IQuoteLine[], fields: any) {
    const { width, height } = fields;

    if (width && height) {
      const widthValue = formGroup[width];
      const heightValue = formGroup[height];
      if (widthValue !== undefined && heightValue !== undefined) {
        const size = Math.ceil((((widthValue < 2000 ? 2000 : widthValue) - 2000) / 100) + 1) + (Math.ceil(((heightValue < 2000 ? 2000 : heightValue) - 2000) / 100) * 12);
        selectedQuoteLines.push({sku: 'ODO0' + ('0' + size).slice(-2), order: 20}, {sku: 'ODO' + (size + 99), order: 20});
      }
    }
  }

  calculateSDHSize(formGroup: any, selectedQuoteLines: IQuoteLine[], fields: any) {
    const table = formGroup[fields.sizeTable];

    for (const row of table) {
      let size = (Math.ceil(row['Breedte'] / 500) * 500 - 2500) / 500 * 2 + 1;
      if (!isNaN(size)) {
        size = size < 1 ? 1 : size;
        if (row['Hoogte'] > 2500) size++;
        selectedQuoteLines.push({sku: 'SDH' + (size + 100), order: 100}, {sku: 'SDH0' + ('0' + size).slice(-2), order: 100});
      }
    }
  }

  combineQuoteLines(quoteLines: IQuoteLine[]): IQuoteLine[] {
    const groupedLines: { [sku: string]: IQuoteLine } = {};
    quoteLines.forEach(quoteLine => {
      if (quoteLine.amountField){
        quoteLine.amount = parseFloat(this.formService.formGroup$.getValue().getRawValue()[quoteLine.amountField])
      }
      groupedLines[quoteLine.sku] = {...quoteLine, amount: (groupedLines[quoteLine.sku]?.amount || 0) + (quoteLine.amount || 1)}
    });
    return Object.values(groupedLines);
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
