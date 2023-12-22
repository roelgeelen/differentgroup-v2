import {Component} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {FormService} from "../../../../_components/dynamic-form-builder/services/form.service";
import {IFormControl} from "../../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {IQuoteLine} from "../../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {QuotationItemComponent} from "./quotation-item.component";

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    QuotationItemComponent
  ],
  styleUrl: './quotation.component.scss'
})
export class QuotationComponent {
  choiceControls: IFormControl[] = [];
  quoteItems: IQuoteLine[] = [];

  constructor(
    private formService: FormService
  ) {
    console.log(this.formService.formGroup$.subscribe(form => {
      this.setChoiceControls();
      this.setQuoteItems(this.formService.formGroup$.getValue().getRawValue());
      form.valueChanges.subscribe(value => {
        // console.log(JSON.stringify(value))
        this.setQuoteItems(value)
      })
    }))
  }

  setQuoteItems(formGroup: any) {
    const selectedQuoteLines: any[] = [];

    Object.keys(formGroup).forEach(groupId => {
      const selectedValue = formGroup[groupId];
      const formControl = this.choiceControls.find(control => control.id === groupId);

      if (formControl) {
        const selectedChoice = formControl.options!.choices!.find(choice => choice.value === selectedValue);

        if (selectedChoice && selectedChoice.quoteLine) {
          selectedQuoteLines.push(selectedChoice.quoteLine);
        }
      }
    });

    this.quoteItems = selectedQuoteLines;
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
