import {Component} from '@angular/core';
import {PlanningService} from "../../data-access/planning.service";
import {ChartType, GoogleChartsModule} from "angular-google-charts";
import {Observable, tap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
@Component({
  selector: 'app-produced',
  templateUrl: './produced.component.html',
  standalone: true,
  imports: [
    GoogleChartsModule,
    AsyncPipe,
    MatProgressSpinner
  ],
  styleUrl: './produced.component.scss'
})
export class ProducedComponent {
  data$:Observable<any>;
  chartColumns:string[] = [];
  type = ChartType.ColumnChart;
  myOptions = {
    colors: ['#4658a0', '#06af85',],
    height: 400,
    backgroundColor: 'transparent',
    legend: {position: 'top', maxLines: 0},
    bar: {groupWidth: '75%'},
    chartArea: {
      left: 43,
      height: 300,
      width: '100%'
    },
    isStacked: true,
    series: {6: {type: 'line'}}
  };

  constructor(private planningService: PlanningService) {

    this.data$ =this.planningService.getProduced().pipe(
      tap({
        next: (data) => {
          this.chartColumns = data[0];
          data.splice(0, 1);
          data.forEach((item: any, index: number) => {
            item[1] = +item[1]
            item[2] = +item[2]
          });
          return data;
        }
      })
    )
  }

}
