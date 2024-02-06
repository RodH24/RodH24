import { NgModule } from '@angular/core';
import { LoginComponent } from './views/login/login.component';
import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';

@NgModule({
  declarations: [
    LoginComponent, 
    AuthModalComponent
  ],
  imports: [
    AuthRoutingModule, 
    SharedModule
  ],
})
export class AuthModule {}
