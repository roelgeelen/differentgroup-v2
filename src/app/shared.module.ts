import {NgModule} from "@angular/core";
import {SafeHtmlPipe} from "./_helpers/pipes/safe-html.pipe";


@NgModule({
  declarations: [SafeHtmlPipe],
// exports is required so you can access your component/pipe in other modules
  exports: [SafeHtmlPipe]
})
export class SharedModule{}
