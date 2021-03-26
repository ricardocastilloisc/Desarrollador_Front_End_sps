import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from './Guards/guest.guard';
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule),
    canActivate: [GuestGuard]
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: 'notes',
    loadChildren: () => import('./content/content/content.module').then(m => m.ContentModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
