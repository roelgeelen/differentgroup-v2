import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {map, Observable, tap} from "rxjs";
import {
  MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {IMeasureTable} from "../../utils/measureTable";
import {SalesService} from "../../data-access/sales.service";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-inmeten',
  templateUrl: './inmeten.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    MatTableModule,
    MatProgressSpinner
  ],
  styleUrl: './inmeten.component.scss'
})
export class InmetenComponent{
  displayedColumns: string[] = ['deadline', 'name', 'city', 'description', 'adviseur', 'shortDescription'];
  table$: Observable<MatTableDataSource<IMeasureTable>>;

  constructor(private salesService: SalesService) {
    this.table$ = this.salesService.getMeasure().pipe(
      map(data => new MatTableDataSource<IMeasureTable>(data))
    );
  }
}
