import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {IFormControl} from "../dynamic-form-builder/form-controls/form-control.interface";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    AsyncPipe
  ],
  styleUrl: './autocomplete-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteFieldComponent),
      multi: true
    }
  ]
})
export class AutocompleteFieldComponent implements OnInit, OnDestroy {
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;
  filteredOptions: any[] = [];
  myControl = new FormControl('');
  @Input() options: any[] = [];
  @Input() title: string = '';
  @Input() valueFunction: ((option: any) => any) | null = null;
  @Input() searchFunction: ((option: any) => string) | null = null;
  valueChangeSubscription: Subscription | null = null;
  @Output() selectionChange = new EventEmitter<string>();
  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  constructor() {

  }

  ngOnDestroy() {
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.filteredOptions = this.options.slice();
    this.valueChangeSubscription = this.myControl.valueChanges.subscribe(v => this.onChange(v))
  }

  filter(): void {
    const filterValue = this.input!.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(option => {
      const searchValue = this.searchFunction ? this.searchFunction(option).toLowerCase() : '';
      return searchValue.includes(filterValue);
    });
  }

  writeValue(value: any) {
    this.myControl.setValue(value); // Set the value to the formControl
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  value(option: any) {
    return option
  }

  search(option: any) {
    return this.searchFunction ? this.searchFunction(this.options.find(i => (this.valueFunction ? this.valueFunction(i) : i) === option)) : option;
  }

  optionSelected($event: MatAutocompleteSelectedEvent) {
    this.selectionChange.emit($event.option.value)
  }
}
