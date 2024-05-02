import {Injectable} from '@angular/core';
import {IQuoteLine} from "../../../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {IFormControl} from "../../../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {IForm} from "../../../../../_components/dynamic-form-builder/models/form.interface";

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor() {
  }

  getQuoteItems(form: IForm, formGroup: any): IQuoteLine[] {
    const choiceControls: IFormControl[] = this.getChoiceControls(form);
    let selectedQuoteLines: IQuoteLine[] = form.options.quoteLines ? [...form.options.quoteLines] : [];
    if (form.options.quoteSizeCalculation === 'odo') {
      this.calculateODOSize(formGroup, selectedQuoteLines, form.options.quoteSizeFields);
    }

    if (form.options.quoteSizeCalculation === 'sdh') {
      this.calculateSDHSize(formGroup, selectedQuoteLines, form.options.quoteSizeFields);
    }

    for (const groupId of Object.keys(formGroup)) {
      const selectedValues = Array.isArray(formGroup[groupId]) ? formGroup[groupId] : [formGroup[groupId]];
      const formControl = choiceControls.find(control => control.id === groupId);

      if (formControl) {
        selectedValues.forEach((selectedValue: any) => {
          const selectedChoice = formControl.options?.choices?.find(choice => choice.value === selectedValue);
          if (selectedChoice && selectedChoice.quoteLine) {
            selectedQuoteLines.push(selectedChoice.quoteLine);
          }
        });
      }
    }
    selectedQuoteLines = this.combineQuoteLines(formGroup, selectedQuoteLines);
    return selectedQuoteLines.sort((a, b) => a.order - b.order || a.sku.localeCompare(b.sku));
  }

  private calculateODOSize(formGroup: any, selectedQuoteLines: IQuoteLine[], fields: any) {
    const {width, height} = fields;

    if (width && height) {
      const widthValue = formGroup[width];
      const heightValue = formGroup[height];
      if (widthValue !== undefined && heightValue !== undefined) {
        const size = Math.ceil((((widthValue < 2000 ? 2000 : widthValue) - 2000) / 100) + 1) + (Math.ceil(((heightValue < 2000 ? 2000 : heightValue) - 2000) / 100) * 12);
        selectedQuoteLines.push({sku: 'ODO0' + ('0' + size).slice(-2), order: 20}, {
          sku: 'ODO' + (size + 99),
          order: 20
        });
      }
    }
  }

  private calculateSDHSize(formGroup: any, selectedQuoteLines: IQuoteLine[], fields: any) {
    const table = formGroup[fields.sizeTable];
    if (table !== undefined) {
      for (const row of table) {
        let size = (Math.ceil(row['Breedte'] / 500) * 500 - 2500) / 500 * 2 + 1;
        if (!isNaN(size)) {
          size = size < 1 ? 1 : size;
          if (row['Hoogte'] > 2500) size++;
          selectedQuoteLines.push({sku: 'SDH' + (size + 100), order: 100}, {
            sku: 'SDH0' + ('0' + size).slice(-2),
            order: 100
          }, {sku: 'SDH600', order: 100});
        }
      }
    }
  }

  private getChoiceControls(form: IForm): IFormControl[] {
    const choiceControls: IFormControl[] = [];
    const formControls = form.pages.flatMap(page => page.controls);

    const pushControlToList = (control: IFormControl) => {
      if (control.options?.choices) {
        choiceControls.push(control);
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

    return choiceControls;
  }

  private combineQuoteLines(formGroup: any, quoteLines: IQuoteLine[]): IQuoteLine[] {
    const groupedLines: { [sku: string]: IQuoteLine } = {};
    quoteLines.forEach(quoteLine => {
      if (quoteLine.amountField) {
        quoteLine.amount = parseFloat(formGroup[quoteLine.amountField]) || 1;
      }
      groupedLines[quoteLine.sku] = {
        ...quoteLine,
        amount: (groupedLines[quoteLine.sku]?.amount || 0) + (quoteLine.amount || 1)
      };
    });
    return Object.values(groupedLines);
  }
}
