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
    ReactiveFormsModule
  ],
  styleUrl: './conversation-edit.component.scss'
})
export class ConversationEditComponent implements OnInit {
  conversationForm = new FormGroup({
    title: new FormControl('', Validators.required),
    body: new FormControl(''),
    managerComment: new FormControl(''),
  });
  id: string | null = null;
  conId: string | null = null;
  user$!: Observable<IUser>;
  // conversation$!: Observable<IConversation>;
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


  constructor(private route: ActivatedRoute, private router: Router, private employeeService: EmployeeService) {
    this.editor = new Editor();
    this.editor2 = new Editor();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id!==null){
        this.user$ = this.employeeService.getEmployee(this.id!);
      }
      this.conId = params.get('conId');
      console.log(this.conId)
      if (this.conId !== null) {
        this.employeeService.getConversation(this.id!, this.conId!).subscribe({
          next: (event: any) => {
            console.log(event)
            this.conversationForm.setValue({
              title: event.title,
              body: event.body,
              managerComment: event.managerComment
            })
          },
          complete: () => {

          }
        })
      }
    })
  }


  save() {
    console.log(this.conId)
    if (this.conId) {
    //   this.newsService.updateNews(news, this.currentFile).subscribe({
    //     next: (event: any) => {
    //
    //     },
    //     error: (err: any) => {
    //
    //     },
    //     complete: () => {
    //
    //     }
    //   });
    } else {
      let conv: IConversation = {
        title:this.conversationForm.controls.title.value!,
        body:this.conversationForm.controls.body.value||'',
        managerComment:this.conversationForm.controls.managerComment.value||undefined,
        isApproved: false,
        isRead: false,
        isPublished: false
      };
      this.employeeService.createConversation(this.id!, conv).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            // this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.router.navigateByUrl('/admin/employees/'+this.id!)
          }
        },
        complete: () => {

        }
      });
    }
  }

  delete(news: INews) {
    Swal.fire({
      title: 'Weet je het zeker?',
      text: 'Wil je dit nieuws item verwijderen?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2e3785',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ja, verwijderen!',
      cancelButtonText: 'Annuleren',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.newsService.deleteNews(news.id!).subscribe(r => {
        //   if (r.type === HttpEventType.UploadProgress) {
        //     // @ts-ignore
        //     this.loading = true;
        //   } else if (r instanceof HttpResponse) {
        //     this.router.navigateByUrl('/admin/news')
        //   }
        // })
      }
    });
  }
}
