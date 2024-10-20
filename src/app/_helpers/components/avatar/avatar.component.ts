import {Component, Input} from '@angular/core';


@Component({
  selector: 'app-avatar',
  template: `
    <img [src]="url" onerror="this.src='./assets/images/user_placeholder.png';" [height]="size" class="avatar {{position}}">
  `,
  standalone: true,
  styles: `.avatar{
    border-radius: 50%;
  }
  .left {margin-left: 8px;}
  .right {margin-right: 8px;}
  `
})
export class AvatarComponent {
  @Input() url: string = '';
  @Input() size: number = 45;
  @Input() position: string | 'left' | 'right' = 'left';
}
