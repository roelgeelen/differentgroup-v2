import {Component} from '@angular/core';
import {ChartType, GoogleChartsModule} from "angular-google-charts";
import {Observable, tap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {WarehouseService} from "../../data-access/warehouse.service";
@Component({
  selector: 'app-produced',
  templateUrl: './stock.component.html',
  standalone: true,
  imports: [
    GoogleChartsModule,
    AsyncPipe,
    MatProgressSpinner
  ],
  styleUrl: './stock.component.scss'
})
export class StockComponent {
  data$:Observable<any>;
  chartColumns:string[] = [];
  type = ChartType.ColumnChart;
  valueExpected = 0;
  value = 0;
  valueH = 0;
  myOptions =  {
    colors: ['#4658a0','#6a7dc7', '#06af85', '#ff0000'],
    height: 500,
    backgroundColor: 'transparent',
    legend: {position: 'top', maxLines: 0},
    bar: {groupWidth: '75%'},
    chartArea: {
      left: 40,
      width: '100%'
    },
    isStacked: true,
    series: {3: {type: 'line'}}
  };

  constructor(private warehouseService: WarehouseService) {

    this.data$ =this.warehouseService.getStock().pipe(
      tap({
        next: (data) => {
          this.chartColumns = data[0];
          this.value = data[1][1];
          this.valueH = data[1][2];
          data.splice(0, 1);
          data.forEach((item: any, index: number) => {
            item[1] = +item[1]
            item[2] = +item[2]
            item[3] = +item[3]
            item[4] = +item[4]
            this.valueExpected += item[3] << 0;
          });
          return data;
        }
      })
    )
  }

}
