import {Component, Inject, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {MatIconModule} from "@angular/material/icon";


@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  standalone: true,
  styleUrl: './preview-dialog.component.scss',
  imports: [MatDialogModule, MatButtonModule, MatInputModule, FormsModule, MatIconModule, ReactiveFormsModule],
})
export class PreviewDialogComponent implements OnInit {
  url?: SafeUrl;
  showIframe = false;
  editUrl = true;

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url3D?: string },
  ) {
  }

  ngOnInit(): void {
    if (this.data.url3D) {
      this.loadUrl()
    }
  }

  submit(form: NgForm) {
    if (form.valid) {
      this.loadUrl()
    }
  }

  private loadUrl() {
    const url = new URL(this.data.url3D!);
    this.data.url3D = 'https://openslaandegaragedeuren.onecore.website/garagedeur-designer?kiosk=1&selected=' + url.searchParams.get('selected');
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.url3D);
    this.showIframe = true;
    this.editUrl = false;
  }
}
