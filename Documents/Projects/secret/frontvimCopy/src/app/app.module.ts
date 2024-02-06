// Angular module 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localesEs from '@angular/common/locales/es';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
// Installed modules 
import { ToastrModule } from 'ngx-toastr';
import { NZ_I18N, es_ES } from 'ng-zorro-antd/i18n';
// Core module
import { CoreModule } from '@core/core.module';
// Shared module 
import { SharedModule } from '@shared/shared.module';
import { SideBarComponent } from '@shared/components/side-bar/side-bar/side-bar.component';
import { MenuOptionComponent } from '@shared/components/side-bar/menu-option/menu-option.component'
// App 
import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
// Modules 
import { AuthModule } from '@modules/auth/auth.module';
// // Layouts 
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';
import { TrackingLayoutComponent } from './layouts/tracking-layout/tracking-layout.component';
import { ContentLayoutComponent } from '@layouts/content-layout/content-layout.component';

// Data 
import { environment } from '../environments/environment';


registerLocaleData(localesEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    AuthLayoutComponent,
    SideBarComponent,
    MenuOptionComponent,
    // ExternalLayoutComponent,
    TrackingLayoutComponent,
  ],
  imports: [
    // angular
    BrowserModule,
    // 3rd party
    AuthModule,
    // core & shared
    CoreModule,
    SharedModule,
    // app
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({}),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
  ],
  providers: [
    { 
      provide: NZ_I18N, 
      useValue: es_ES 
    },
    { 
      provide: LOCALE_ID, 
      useValue: 'es'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
