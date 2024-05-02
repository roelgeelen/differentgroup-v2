import {Component, Input, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {HistoryItemComponent} from "../../../ui/history-item/history-item.component";
import {DecimalPipe} from "@angular/common";
import {IConfigChanges} from "../../../utils/configuration-change.interface";
import {ConfigurationService} from "../../../data-access/configuration.service";
import {ActivatedRoute} from "@angular/router";
import {IPage} from "../../../../../_models/page.interface";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-configuration-history',
  templateUrl: './configuration-history.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    HistoryItemComponent,
    DecimalPipe,
    MatIconModule
  ],
  styleUrl: './configuration-history.component.scss'
})
export class ConfigurationHistoryComponent implements OnInit {
  configId: string | null = null;
  page: number = 0;
  data?:IPage<any>
  changesList: IConfigChanges[] = [];

  constructor(
    private apiConfiguration: ConfigurationService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.configId = params.get('configId');
      if (this.configId !== null) {
        this.getHistory()
      }
    })
  }

  getHistory() {
    this.apiConfiguration.getConfigurationChanges(this.configId!, this.page).subscribe(c => {
      this.data = c;
      this.changesList?.push(...c.content);
    })
  }

  loadMore() {
    this.page++;
    this.getHistory();
  }
}
