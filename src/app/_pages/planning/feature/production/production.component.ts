import {Component} from '@angular/core';
import {PlanningService} from "../../data-access/planning.service";
import {ChartType, GoogleChartsModule} from "angular-google-charts";
import {Observable, tap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  standalone: true,
  imports: [
    GoogleChartsModule,
    AsyncPipe,
    MatProgressSpinner
  ],
  styleUrl: './production.component.scss'
})
export class ProductionComponent {
  totalProjects$: Observable<any>;
  totalOrders$: Observable<any>;
  totalToSchedule$: Observable<any>;
  totalUB$: Observable<any>;
  data$:Observable<any>;
  chartColumns:string[] = [];
  type = ChartType.ColumnChart;
  myOptions = {
    colors: [
      '#00994d',
      '#06af85',
      '#7c46a0',
      '#4658a0',
      '#7382bf',
      '#626262',
      '#dcdcdc',
      '#231e1f',
      '#ff0000'
    ],
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
    series: {8: {type: 'line'}},
    vAxis: {
      maxValue:300,
    },
    hAxis: {
      textStyle: {
        fontSize: 14 // or the number you want
      }
    }
  };

  constructor(private planningService: PlanningService) {
    this.totalProjects$ = this.planningService.getProjects();
    this.totalOrders$ = this.planningService.getOrders();
    this.totalToSchedule$ = this.planningService.getSchedule();
    this.totalUB$ = this.planningService.getUB();
    this.data$ =this.planningService.getProduction().pipe(
      tap({
        next: (data) => {
          this.chartColumns = data[0];
          data.splice(0, 1);
          data.forEach((item: any, index: number) => {
            if (item.length == 2) {
              data.splice(index, 1);
            }
            item[1] = +item[1]
            item[2] = +item[2]
            item[3] = +item[3]
            item[4] = +item[4]
            item[5] = +item[5]
            item[6] = +item[6]
            item[7] = +item[7]
            item[8] = +item[8]
            item[9] = +item[9]
          });
          return data;
        }
      })
    )
  }

}
