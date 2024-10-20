import {Component, OnInit} from '@angular/core';
import {AutocompleteFieldComponent} from "../../../../_components/autocomplete-field/autocomplete-field.component";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {map, Observable, of} from "rxjs";
import {EmployeeService} from "../../data-access/employee.service";
import {AsyncPipe, DatePipe} from "@angular/common";
import {IUser} from "../../utils/user";
import {IRole} from "../../utils/role";
import {MatChipsModule} from "@angular/material/chips";
import {
  MatTableDataSource, MatTableModule
} from "@angular/material/table";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {DataErrorMessageComponent} from "../../../../_components/data-error-message/data-error-message.component";
import {catchError} from "rxjs/operators";
import {IConversation} from "../../utils/conversation";
import {AvatarComponent} from "../../../../_helpers/components/avatar/avatar.component";
import {MatDialog} from "@angular/material/dialog";
import {AddManagerDialogComponent} from "../../ui/add-manager-dialog/add-manager-dialog.component";
import {AuthService} from "@auth0/auth0-angular";
import Swal from "sweetalert2";
import {AuthenticationService} from "../../../../_auth/authentication.service";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-employees-detail',
  standalone: true,
  imports: [
// Core Angular Modules
    FormsModule,
    RouterLink,
    AsyncPipe,
    DatePipe,

    // Custom Components
    AutocompleteFieldComponent,
    DataErrorMessageComponent,
    AvatarComponent,

    // Angular Material Modules
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './employees-detail.component.html',
  styleUrls: ['./employees-detail.component.scss', '../../../../../assets/styles/table-list.scss']
})
export class EmployeesDetailComponent implements OnInit {
  id: string | null = null;
  user$!: Observable<IUser>;
  roles$!: Observable<IRole[]>;
  isEditPoints = false;
  isEditFunction = false;
  totalElem: number = 0;
  pageIndex: number = 0;
  pageSize: number = 5;
  conversationColumns: string[] = ['picture', 'title', 'created', 'last_login', 'status', 'actions'];
  conversations$!: Observable<MatTableDataSource<IConversation>>;
  conversationError = false;


  constructor(
    private route: ActivatedRoute,
    protected authService: AuthenticationService,
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    protected auth: AuthService,
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
        this.totalElem = data.page.totalElements;
        return new MatTableDataSource<IConversation>(data.content)
      }),
      catchError(err => {
        this.conversationError = true;
        return of();
      })
    );
  }

  editPoints(user: IUser, points: number) {
    if (this.isEditPoints) {
      this.employeeService.patchEmployeePoints(user.user_id, points).subscribe({
        next: data => {
          if (data.app_metadata == undefined) {
            data.app_metadata = {};
          }
          user.app_metadata!.points = data.app_metadata.points;
        },
        error: err => {
          console.log(err);
        }
      })
    }
    this.isEditPoints = !this.isEditPoints
  }

  editFunction(user: IUser, functionGroup: string) {
    if (this.isEditFunction) {
      this.employeeService.patchEmployeeFunction(user.user_id, functionGroup).subscribe({
        next: data => {
          if (data.app_metadata == undefined) {
            data.app_metadata = {};
          }
          user.app_metadata!.function_group = data.app_metadata.function_group;
        },
        error: err => {
          console.log(err);
        }
      })
    }
    this.isEditFunction = !this.isEditFunction
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
      if (result.isConfirmed) {
        let managers = [...user.app_metadata?.managers || []];
        managers.splice(managers.indexOf(manager), 1);
        this.employeeService.patchEmployeeManagers(user.user_id, managers).subscribe({
          next: data => {
            if (data.app_metadata == undefined) {
              data.app_metadata = {};
            }
            user.app_metadata!.managers = data.app_metadata.managers || [];
          },
          error: err => {
            console.log(err);
          }
        });
      }
    });
  }

  deleteConversation(conId: string) {
    Swal.fire({
      title: 'Weet je het zeker?',
      text: 'Wil je dit verslag verwijderen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e3785',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ja, verwijderen!',
      cancelButtonText: 'Annuleren',
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteConversation(this.id!, conId).subscribe(r => {
          this.getConversations();
        })
      }
    });
  }
}
