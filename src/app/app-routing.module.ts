import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./_pages/home/home.component";
import {FormsComponent} from "./_pages/forms/forms.component";
import {AdminComponent} from "./_pages/admin/admin.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'forms',
    component: FormsComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
