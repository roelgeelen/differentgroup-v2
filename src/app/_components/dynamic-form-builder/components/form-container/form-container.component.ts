import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  CdkDragRelease,
  CdkDragMove
} from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  Input, OnDestroy,
  ViewChild,
} from '@angular/core';
import {IFormPage} from '../../models/form-container.interface';
import {DragDropService} from '../../services/drag-drop.service';
import {FormService} from '../../services/form.service';
import {IFormControl} from "../../form-controls/form-control.interface";
import Swal from "sweetalert2";
import {UtilityService} from "../../services/utility.service";
import {FormControlsService} from "../../form-controls/form-controls.service";
import {ApiFormService} from "../../../../_services/api-form.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss']
})
export class FormContainerComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  @Input() container: IFormPage | undefined;
  @Input() showOutline = true;
  @Input() showInvisible = false;
  @Input() isBuilder = false;
  @Input() id = '';
  selectedControl: IFormControl | null = null;
  selectedControlSubscription: Subscription;

  constructor(
    private dragDropService: DragDropService,
    public formService: FormService,
    public utilityService: UtilityService,
    private formControlsService: FormControlsService,
    private apiFormService: ApiFormService
  ) {
    this.selectedControlSubscription = this.formService.selectedControl$.subscribe((control) =>
      this.selectedControl = control
    );
  }

  ngOnDestroy() {
    if (this.selectedControlSubscription) {
      this.selectedControlSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (this.dropList) {
      this.dragDropService.register(this.dropList);
    }
  }

  public showControl(item: IFormControl) {
    return (this.utilityService.isShow(item.options?.dependent ?? []) && (item.options?.visibility?.showInForm === undefined || item.options?.visibility?.showInForm))
  }

  public get connectedLists() {
    return this.dragDropService.dropLists;
  }

  public allowDropPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    return this.dragDropService.isDropAllowed(drag, drop);
  };

  public dropped(event: CdkDragDrop<IFormControl[]>) {
    this.dragDropService.drop(event);
  }

  public dragMoved(event: CdkDragMove<IFormControl>) {
    this.dragDropService.dragMoved(event);
  }

  public dragReleased(event: CdkDragRelease) {
    this.dragDropService.dragReleased(event);
  }

  public selectControl(item: IFormControl) {
    // Update options
    item.options = new this.formControlsService.controlTypes[item.type](item.options).options
    this.formService.onControlSelected(item);
  }

  public removeControl(controls: IFormControl[], index: number) {
    Swal.fire({
      title: 'Weet je het zeker?',
      text: 'Wil je deze vraag verwijderen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e3785',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ja, verwijderen!',
      cancelButtonText: 'Annuleren',
    }).then((result) => {
      if (result.isConfirmed) {
        const c = controls[index];
        if (c.options?.image) {
          this.apiFormService.removeFormAttachment(this.formService.form$.getValue().id!.toString(), c.options.image.id).subscribe();
        }
        controls.splice(index, 1);
        this.formService.updateFormGroup();
        this.formService.onControlSelected(null);
      }
    });

  }
}
