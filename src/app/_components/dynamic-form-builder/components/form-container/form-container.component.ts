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
import {Subscription} from "rxjs";
import {IFormControlOptionsDependent} from "../../form-controls/form-control-options.interface";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MatMenuTrigger} from "@angular/material/menu";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss']
})
export class FormContainerComponent implements AfterViewInit, OnDestroy {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  @ViewChild(MatMenuTrigger) contextMenu?: MatMenuTrigger;
  @Input() container: IFormPage | undefined;
  @Input() showOutline = true;
  @Input() showInvisible = false;
  @Input() isBuilder = false;
  @Input() id = '';
  selectedControl: IFormControl | null = null;
  selectedControlSubscription: Subscription;
  contextMenuPosition = {x: '0px', y: '0px'};

  constructor(
    private dragDropService: DragDropService,
    public formService: FormService,
    public utilityService: UtilityService,
    private formControlsService: FormControlsService,
    private http: HttpClient,
    private _snackBar: MatSnackBar

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

  public removeControl(index: number) {
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
        const c = this.container!.controls[index];
        if (c.options?.image) {
          this.removeFormAttachment(this.formService.form$.getValue().id!.toString(), c.options.image.id).subscribe();
        }
        this.container!.controls.splice(index, 1);
        this.formService.updateFormGroup();
        this.formService.onControlSelected(null);
      }
    });

  }

  showDependent(dependent: IFormControlOptionsDependent[]) {
    return dependent.map(item => `${this.formService.findControlById(item.field)?.options?.label}: [${item.values.join(', ')}]`).join('\n');
  }

  removeFormAttachment(id: string, attachment: string) {
    return this.http.delete(`${environment.apiUrlV2}/v2/forms/${id}/attachments/${attachment}`, {
      reportProgress: true,
      observe: 'events'
    });
  }

  onContextMenu(event: MouseEvent, index?: number) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu!.menuData = {'index': index};
    this.contextMenu!.menu?.focusFirstItem('mouse');
    this.contextMenu?.openMenu();
  }

  cutControl(index: number) {
    this.formService.onControlCopied(this.container!.controls[index]);
    this.container!.controls.splice(index, 1);
    this.formService.updateFormGroup();
    this.formService.onControlSelected(null);
    this._snackBar.open('Gekopieerd naar klembord', '', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackbar-info']
    });
  }

  pasteControl(index: number) {
    this.container?.controls.splice(index, 0 , this.formService.copiedControl$.value!);
    this.formService.updateFormGroup();
    this.formService.onControlSelected(null);
    this.formService.onControlCopied(null)
  }
}
