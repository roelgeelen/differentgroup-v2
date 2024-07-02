import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[nxNoScroll]',
  standalone: true
})
export class NxNoScrollDirective {

  @HostListener('wheel', ['$event'])
  onWheel(event: Event) {
    event.preventDefault();
  }

}
