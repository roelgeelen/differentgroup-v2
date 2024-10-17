import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Observable, of} from "rxjs";
import {INews} from "../../utils/news";
import {NewsService} from "../../data-access/news.service";
import {AsyncPipe, Location} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {ImageLoaderComponent} from "../../ui/image-loader/image-loader.component";
import {MatProgressBar} from "@angular/material/progress-bar";
import Swal from "sweetalert2";
import {EmployeeService} from "../../data-access/employee.service";
import {IConversation} from "../../utils/conversation";
import {AvatarComponent} from "../../../../_helpers/components/avatar/avatar.component";
import {IUser} from "../../utils/user";
import {MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {SafeHtmlPipe} from "../../../../_helpers/pipes/safe-html.pipe";
import {DndDirective} from "../../../../_helpers/directives/dnd.directive";

@Component({
  selector: 'app-news-edit',
  templateUrl: './conversation-edit.component.html',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    RouterLink,
    AsyncPipe,
    MatProgressSpinner,
    MatSlideToggle,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInput,
    NgxEditorModule,
    MatIconButton,
    MatMiniFabButton,
    ImageLoaderComponent,
    MatProgressBar,
    AvatarComponent,
    MatAutocompleteTrigger,
    SafeHtmlPipe,
    ReactiveFormsModule,
    DndDirective
  ],
  styleUrl: './conversation-edit.component.scss'
})
export class ConversationEditComponent implements OnInit {
  conversationForm = new FormGroup({
    title: new FormControl('', Validators.required),
    body: new FormControl(''),
    managerComment: new FormControl(''),
    isPublished: new FormControl(false),
  });
  id: string | null = null;
  conId: string | null = null;
  user$!: Observable<IUser>;
  files$!: Observable<any>;
  editor: Editor;
  editor2: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  uploadError: string | null = null;
  progress: number | null = null


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.editor = new Editor();
    this.editor2 = new Editor();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id !== null) {
        this.user$ = this.employeeService.getEmployee(this.id!);
      }
      this.conId = params.get('conId');
      if (this.conId !== null) {
        this.getConversation();
      }
    })
  }

  getConversation() {
    this.getFiles();
    this.employeeService.getConversation(this.id!, this.conId!).subscribe({
      next: (event: any) => {
        console.log(event)
        this.conversationForm.setValue({
          title: event.title,
          body: event.body,
          managerComment: event.managerComment,
          isPublished: event.isPublished
        })
      },
      complete: () => {

      }
    })
  }

  getFiles() {
    this.files$ = this.employeeService.getFiles(this.id!, this.conId!);
  }

  save() {
    console.log(this.conId)
    if (this.conId) {
      let conv: IConversation = {
        title: this.conversationForm.controls.title.value!,
        body: this.conversationForm.controls.body.value || '',
        managerComment: this.conversationForm.controls.managerComment.value || undefined,
        isPublished: this.conversationForm.controls.isPublished.value || false,
      };
      this.employeeService.updateConversation(this.id!, this.conId!, conv).subscribe({
        next: (event: any) => {
          this.router.navigateByUrl(`/admin/employees/${this.id!}/conversations/${this.conId}`)
        },
        error: (err: any) => {

        },
        complete: () => {

        }
      });
    } else {
      let conv: IConversation = {
        title: this.conversationForm.controls.title.value!,
        body: this.conversationForm.controls.body.value || '',
        managerComment: this.conversationForm.controls.managerComment.value || undefined,
        isApproved: false,
        isRead: false,
        isPublished: this.conversationForm.controls.isPublished.value || false,
      };
      this.employeeService.createConversation(this.id!, conv).subscribe({
        next: (event: IConversation) => {

          // this.router.navigateByUrl('/admin/employees/' + this.id!)
          console.log(event);
          this.conId = event.id!;
          this.location.replaceState(`/admin/employees/${this.id}/conversations/${event.id}/edit`);
          this.getConversation();
        },
        complete: () => {

        }
      });
    }
  }

  onFileDropped(event: any) {
    this.uploadFile(event.target.files);
  }

  fileBrowseHandler(event: any) {
    this.uploadFile(event.target.files);
  }

  uploadFile(files: FileList) {
    this.uploadError = null;
    const file = files.item(0);
    console.log(file!.size);
    if (file !== null && file.size < 6000000) {
      this.employeeService.uploadFile(this.id!, this.conId!, file!).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.getFiles();
            this.progress = null;
          }
        },
        error: (err: any) => {
          this.progress = null;
          this.uploadError = 'Uploaden mislukt!'
        },
        complete: () => {

        }
      });
    } else {
      this.uploadError = 'Bestand is  te groot';
    }
  }

  lockFile(file: any) {
    this.employeeService.updateFile(this.id!, this.conId!, file.name, {locked: file.tags.locked != 'true'}).subscribe(r => {
      this.getFiles();
    })
  }

  deleteFile(file: any) {
    Swal.fire({
      title: 'Weet je het zeker?',
      text: 'Wil je dit bestand verwijderen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e3785',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ja, verwijderen!',
      cancelButtonText: 'Annuleren',
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteFile(this.id!, this.conId!, file.name).subscribe(r => {
          this.getFiles();
        })
      }
    });
  }

  delete() {
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
        this.employeeService.deleteConversation(this.id!, this.conId!).subscribe(r => {
          this.router.navigateByUrl(`/admin/employees/${this.id}`)
        })
      }
    });
  }
}
