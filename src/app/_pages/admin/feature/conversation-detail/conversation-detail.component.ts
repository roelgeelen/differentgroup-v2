import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterModule} from "@angular/router";
import {map, Observable, of} from "rxjs";
import {EmployeeService} from "../../data-access/employee.service";
import {IUser} from "../../utils/user";
import {IRole} from "../../utils/role";
import {
  MatTableDataSource
} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {catchError} from "rxjs/operators";
import {IConversation} from "../../utils/conversation";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {AsyncPipe, DatePipe} from "@angular/common";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SafeHtmlPipe} from "../../../../_helpers/pipes/safe-html.pipe";
import {MatTooltip} from "@angular/material/tooltip";
import {AvatarComponent} from "../../../../_helpers/components/avatar/avatar.component";

@Component({
  selector: 'app-employees-detail',
  standalone: true,
  imports: [
    MatIconModule,
    AsyncPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
    SafeHtmlPipe,
    DatePipe,
    MatTooltip,
    AvatarComponent
  ],
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.scss', '../../../../../assets/styles/table-list.scss']
})
export class ConversationDetailComponent implements OnInit {
  id: string | null = null;
  conId: string | null = null;
  user$!: Observable<IUser>;
  conversation$!: Observable<IConversation>;

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.conId = params.get('conId');
      if (params.get('conId') !== null) {
        this.user$ = this.employeeService.getEmployee(this.id!);
        this.conversation$ = this.employeeService.getConversation(this.id!, this.conId!);
      }
    })
  }

}
