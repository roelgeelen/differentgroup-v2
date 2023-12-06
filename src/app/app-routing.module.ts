import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./_pages/home/home.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'configurations',
    loadChildren: () => import('./_pages/configurations/routes').then(mod => mod.CONFIGURATIONS_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./_pages/admin/routes').then(mod => mod.ADMIN_ROUTES)
  },
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
