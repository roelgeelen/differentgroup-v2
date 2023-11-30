import {NgModule} from "@angular/core";
import {SafeHtmlPipe} from "./_helpers/pipes/safe-html.pipe";
import {IsArrayPipe} from "./_helpers/pipes/is-array.pipe";


@NgModule({
  declarations: [SafeHtmlPipe, IsArrayPipe],
  exports: [SafeHtmlPipe, IsArrayPipe]
})
export class SharedModule{}
