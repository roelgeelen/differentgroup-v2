import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {addDays, subDays, format} from "date-fns";
import {map, Observable, tap} from "rxjs";
import {
  MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {AsyncPipe, DatePipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {IChecklistItem} from "../../utils/checklist-item";
import {WarehouseService} from "../../data-access/warehouse.service";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatInput} from "@angular/material/input";
import {provideNativeDateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-inmeten',
  templateUrl: './checklist.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNativeDateAdapter()
  ],
  imports: [
    AsyncPipe,
    MatTableModule,
    MatProgressSpinner,
    MatCheckbox,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatInput
  ],
  styleUrl: './checklist.component.scss'
})
export class ChecklistComponent {
  displayedColumns: string[] = ['workDate', 'workTime', 'customer', 'customerNo', 'no', 'employee', 'memo', 'shortMemo', 'link', 'check'];
  table$!: Observable<MatTableDataSource<IChecklistItem>>;
  date: Date = addDays(new Date(), 0);
  type: string = "OPENSLAANDE";

  constructor(private warehouseService: WarehouseService) {
    this.getChecklist();
  }

  getChecklist() {
    this.table$ = this.warehouseService.getChecklist(format(this.date, 'yyyy-MM-dd'), this.type).pipe(
      map(data => {
        console.log(data)
        return new MatTableDataSource<IChecklistItem>(data)
      })
    );
  }

  prev() {
    this.date = subDays(this.date, 1);
    this.getChecklist();
  }

  next() {
    this.date = addDays(this.date, 1);
    this.getChecklist();
  }

  updatePriority(element: IChecklistItem) {
    this.warehouseService.updatePick(element.id, element.priorityCode).subscribe();
  }
}
