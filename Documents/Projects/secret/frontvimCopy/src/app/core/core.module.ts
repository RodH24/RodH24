import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { throwIfAlreadyLoaded } from '@core/guards/module-import.guard';
import { TokenInterceptor } from '@core/interceptors/token.interceptor';
import {
  AuthGuard,
  NoAuthGuard,
  UniversalGuard,
} from '@core/guards';
@NgModule({
  imports: [HttpClientModule],
  providers: [
    AuthGuard,
    NoAuthGuard,
    UniversalGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
