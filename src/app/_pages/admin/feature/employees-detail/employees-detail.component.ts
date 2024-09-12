import {Component, OnInit} from '@angular/core';
import {AutocompleteFieldComponent} from "../../../../_components/autocomplete-field/autocomplete-field.component";
import {FormsModule} from "@angular/forms";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {map, Observable, of} from "rxjs";
import {EmployeeService} from "../../data-access/employee.service";
import {AsyncPipe, DatePipe} from "@angular/common";
import {IUser} from "../../utils/user";
import {IRole} from "../../utils/role";
import {MatChipsModule} from "@angular/material/chips";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {DataErrorMessageComponent} from "../../../../_components/data-error-message/data-error-message.component";
import {catchError} from "rxjs/operators";
import {IConversation} from "../../utils/conversation";
import {AvatarComponent} from "../../../../_helpers/components/avatar/avatar.component";
import {MatDialog} from "@angular/material/dialog";
import {AddManagerDialogComponent} from "../../ui/add-manager-dialog/add-manager-dialog.component";
import {AuthService} from "@auth0/auth0-angular";
import Swal from "sweetalert2";
import {AuthenticationService} from "../../../../_auth/authentication.service";

@Component({
  selector: 'app-employees-detail',
  standalone: true,
  imports: [
    AutocompleteFieldComponent,
    FormsModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    RouterLink,
    AsyncPipe,
    DatePipe,
    MatButtonModule,
    MatPrefix,
    MatSuffix,
    MatChipsModule,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatNoDataRow,
    DataErrorMessageComponent,
    AvatarComponent,
    MatHint
  ],
  templateUrl: './employees-detail.component.html',
  styleUrls: ['./employees-detail.component.scss','../../../../../assets/styles/table-list.scss']
})
export class EmployeesDetailComponent implements OnInit {
  id: string | null = null;
  user$!: Observable<IUser>;
  roles$!: Observable<IRole[]>;
  edit = false;
  totalElem: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;
  conversationColumns: string[] = ['picture', 'name', 'email', 'last_login'];
  conversations$!: Observable<MatTableDataSource<IConversation>>;
  conversationError = false;


  constructor(
    private route: ActivatedRoute,
    protected authService: AuthenticationService,
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    protected auth:AuthService,
    ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (params.get('id') !== null) {
        this.user$ = this.employeeService.getEmployee(this.id!);
        this.roles$ = this.employeeService.getRoles(this.id!);
        this.getConversations();
      }
    })
  }

  getConversations() {
    this.conversationError = false;
    this.conversations$ = this.employeeService.getConversations(this.id!, this.pageIndex, this.pageSize).pipe(
      map(data => {
        this.totalElem = data.totalElements;
        return new MatTableDataSource<IConversation>(data.content)
      }),
      catchError(err => {
        this.conversationError = true;
        return of();
      })
    );
  }

  editPoints(user: IUser, points: number) {
    if(this.edit){
      this.employeeService.patchEmployeePoints(user.user_id, points).subscribe({
        next: data => {
          if (data.app_metadata==undefined){
            data.app_metadata={};
          }
          user.app_metadata!.points = data.app_metadata.points;
        },
        error: err => {console.log(err);}
      })
    }
    this.edit = !this.edit
  }

  onPageFired($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.getConversations();
  }

  openDialog(option: IUser): void {
    this.dialog.open(AddManagerDialogComponent, {
      data: option,
    });
  }

  removeManager(user: IUser, manager: string) {
    Swal.fire({
      title: "Manager verwijderen?",
      text: `Wil je ${manager} verwijderen?`,
      icon: "warning",
      showDenyButton: true,
      confirmButtonColor: '#2e3785',
      cancelButtonColor: '#d33',
      confirmButtonText: "Ja",
      denyButtonText: `Annuleren`
    }).then((result) => {
      if (result.isConfirmed){
        let managers = [...user.app_metadata?.managers||[]];
        managers.splice(managers.indexOf(manager), 1);
        this.employeeService.patchEmployeeManagers(user.user_id, managers).subscribe({
          next: data => {
            if (data.app_metadata==undefined){
              data.app_metadata={};
            }
            user.app_metadata!.managers = data.app_metadata.managers||[];
          },
          error: err => {console.log(err);}
        });
      }
    });
  }
}
