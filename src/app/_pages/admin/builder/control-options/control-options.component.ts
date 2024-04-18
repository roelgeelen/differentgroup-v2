import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray
} from "@angular/cdk/drag-drop";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatRippleModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {SharedModule} from "../../../../shared.module";
import {IFormControl} from "../../../../_components/dynamic-form-builder/form-controls/form-control.interface";
import {FormService} from "../../../../_components/dynamic-form-builder/services/form.service";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ApiFormService} from "../../../../_services/api-form.service";
import {
  IFormAttachment,
  IFormControlOptionsChoices, IFormControlOptionsColumns, IFormControlOptionsDependent, inputTypes
} from "../../../../_components/dynamic-form-builder/form-controls/form-control-options.interface";
import {DndDirective} from "../../../../_helpers/directives/dnd.directive";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {User} from "../../../../_auth/models/User";
import {AuthenticationService} from "../../../../_auth/authentication.service";
import {ChoiceDialogComponent} from "./choice-dialog/choice-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {v4 as uuidV4} from "uuid";
import {AutocompleteFieldComponent} from "../../../../_components/autocomplete-field/autocomplete-field.component";
import {ClipboardModule} from "@angular/cdk/clipboard";
import {Subscription} from "rxjs";
import {ApiDealService} from "../../../../_services/api-deal.service";
import {ISchemaProperty} from "../../../../_models/hubspot/schema.interface";
import {FormControlsService} from "../../../../_components/dynamic-form-builder/form-controls/form-controls.service";
import {DragDropService} from "../../../../_components/dynamic-form-builder/services/drag-drop.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-control-options',
  templateUrl: './control-options.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AsyncPipe,
    FormsModule,
    NgxEditorModule,
    MatSelectModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPlaceholder,
    SharedModule,
    MatSlideToggleModule,
    MatCardModule,
    MatDividerModule,
    MatRippleModule,
    MatTooltipModule,
    MatAutocompleteModule,
    DndDirective,
    NgOptimizedImage,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    AutocompleteFieldComponent,
    ClipboardModule
  ],
  styleUrl: './control-options.component.scss'
})
export class ControlOptionsComponent implements OnInit, OnDestroy {
  @Output() onClose = new EventEmitter<any>();
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['text_color', 'background_color'],
  ];
  inputTypes: { value: string, name: string }[] = inputTypes;
  dependentControl = new FormControl<IFormControl | null>(null, Validators.required);
  dependentOptions: IFormControl[] = [];
  hubspotFieldOptions: ISchemaProperty[] = [];
  progress: number = 0;
  currentUser: User | undefined;
  formServiceSubscription: Subscription | undefined;
  valueChangeSubscription: Subscription | undefined;

  constructor(
    private authService: AuthenticationService,
    public formService: FormService,
    private apiFormService: ApiFormService,
    private apiDealService: ApiDealService,
    public dialog: MatDialog,
    private formControlsService: FormControlsService,
    private dragDropService: DragDropService
  ) {
    this.editor = new Editor();
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user!;
    });
  }

  ngOnInit(): void {
    this.formServiceSubscription = this.formService.selectedControl$.subscribe(c => {
      if (c && c.options?.dependent !== undefined) {
        this.dependentOptions = this.getAvailableDependentFields;
      }
    })
    this.valueChangeSubscription = this.dependentControl.valueChanges.subscribe(value => {
      this.dependentOptions = this.getAvailableDependentFields;
    })
    this.apiDealService.getDealSchema().subscribe(schema => {
      this.hubspotFieldOptions = schema.properties;
    })
  }

  ngOnDestroy(): void {
    if (this.formServiceSubscription) {
      this.formServiceSubscription.unsubscribe();
    }
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
  }

  public changeControl(item: IFormControl, newType: any) {
    let newControl = new this.formControlsService.controlTypes[newType.value](item.options);
    newControl.id = item.id;
    newType.value === 'CheckBox' ? newControl.value = [item.value] : item.value instanceof Array ? newControl.value = item.value[0] : newControl.value = item.value;
    this.formService.form$.value.pages.forEach(p => {
      const itemIndex = p.controls.findIndex(c => c.id === item.id);
      if (itemIndex !== -1) {
        p.controls.splice(itemIndex, 1, newControl)
      }
    });
    this.dragDropService.controlDropped.next(newControl);
  }

  close() {
    this.onClose.emit();
  }

  get control() {
    return this.formService.selectedControl$.getValue()!;
  }

  get formControl() {
    return this.formService.formGroup$.getValue()!.controls[this.control.id];
  }


  drop(choices: any[], event: CdkDragDrop<string[]>) {
    moveItemInArray(choices, event.previousIndex, event.currentIndex);
  }

  addChoice(choices: IFormControlOptionsChoices[]) {
    choices.push({id: uuidV4(), value: 'Optie'})
  }

  addColumn(choices: IFormControlOptionsColumns[]) {
    choices.push({key: '', type: 'text'})
  }

  openDialog(option: IFormControlOptionsChoices): void {
    this.dialog.open(ChoiceDialogComponent, {
      data: option,
    });
  }

  addDependent(dependents: IFormControlOptionsDependent[]) {
    if (this.dependentControl.value !== null) {
      if (this.formService.selectedControl$.value?.options?.validators?.required) {
        this.formService.selectedControl$.value.options.validators.required = false;
      }
      dependents.push({
        field: this.dependentControl.getRawValue()!.id, values: []
      });
      this.dependentControl.reset();
    }
  }

  removeFromList(choices: any[], index: number) {
    choices.splice(index, 1);
  }

  get getAvailableDependentFields() {
    const dependentIds = this.control.options!.dependent!.map(dependent => dependent.field);
    const list: IFormControl[] = [];
    const formControls = this.formService.form$.getValue().pages.flatMap(page => page.controls);

    const isEligibleControl = (control: IFormControl) => {
      return (
        this.control.id !== control.id &&
        !dependentIds.includes(control.id) &&
        (control.type === 'RadioBtn' || control.type === 'CheckBox' || control.type === 'Dropdown')
      );
    };

    const pushControlToList = (control: IFormControl) => {
      if (isEligibleControl(control)) {
        list.push(control);
      }
    };

    formControls.forEach(control => {
      if ((control.type === 'Columns' && control.columns) && this.control.id !== control.id) {
        control.columns.forEach(col => {
          col.container.controls.forEach(subControl => {
            pushControlToList(subControl);
          });
        });
      } else {
        pushControlToList(control);
      }
    });

    return list;
  }

  dependentSearchFunction(option: any): string {
    return option?.options?.label ?? '';
  }

  hubspotSearchFunction(option: any): string {
    return option?.label ?? '';
  }

  hubspotValueFunction(option: any): any {
    return option.name;
  }

  updateValue($event: Event) {
    this.formControl.setValue($event);
  }

  prepareFilesList(control: IFormControl, files: FileList) {
    const file = files.item(0);
    if (file !== null && file.size < 5000000) {
      this.apiFormService.upload(this.formService.form$.getValue().id!.toString(), control.id, file).subscribe({
        next: (data: any) => {
          if (data.type === HttpEventType.UploadProgress) {
            control.options!.image = {id: ''};
            this.progress = Math.round((100 * data.loaded) / data.total);
          } else if (data instanceof HttpResponse) {
            control.options!.image = data.body;
            this.saveForm();
            this.progress = 0;
          }
        },
        error: (e) => {
          console.log(e);
        }
      });
    }
  }

  onFileDropped(control: IFormControl, event: any) {
    this.prepareFilesList(control, event);
  }

  fileBrowseHandler(control: IFormControl, event: any) {
    this.prepareFilesList(control, event.target.files);
  }

  removeImage(control: IFormControl, image: IFormAttachment) {
    this.apiFormService.removeFormAttachment(this.formService.form$.getValue().id!.toString(), image.id).subscribe(r => {
        this.control.options!.image = null;
        this.saveForm();
      }
    )
  }

  saveForm() {
    this.formService.setLoadingStatus(true);
    const form = this.formService.form$.getValue();
    form.updatedBy = this.currentUser?.name;
    this.apiFormService.saveForm(this.formService.form$.getValue()).subscribe(f => {
      this.formService.setLoadingStatus(false);
    });
  }

  hubspotSelected($event: any, control: IFormControl) {
    if (control.options?.choices !== undefined) {
      const field = this.hubspotFieldOptions.find(f => f.name === $event)
      if (field !== undefined && field?.options.length > 0) {
        Swal.fire({
          title: "Hubspot opties overnemen?",
          text: "Je huidige opties worden verwijderd.",
          icon: "info",
          showDenyButton: true,
          confirmButtonColor: '#2e3785',
          // cancelButtonColor: '#d33',
          confirmButtonText: "Ja",
          denyButtonText: `Nee`
        }).then((result) => {
          if (result.isConfirmed) {
            control.options!.choices = field.options.map(item => {
              return {
                id: uuidV4(),
                value: item.value
              };
            })
          }
        })
      }
    }
  }
}
