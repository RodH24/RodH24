import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './views/login/login.component';
import { NoAuthGuard } from '@core/guards';

const routes: Routes = [
  {
    path: 'usuario',
    component: AuthLayoutComponent,
    canActivate: [NoAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
