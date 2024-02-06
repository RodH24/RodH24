import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackingLayoutComponent } from './layouts/tracking-layout/tracking-layout.component';

import { ContentLayoutComponent } from '@layouts/content-layout/content-layout.component';
import { UniversalGuard } from '@core/guards';

const routes: Routes = [
  {
    path: 'dependencia',
    component: TrackingLayoutComponent,
    canLoad: [UniversalGuard],
    canActivateChild: [UniversalGuard],
    loadChildren: () =>import('@modules/dependency/dependency.module').then((m) => m.DependencyModule),
  },
  {
    path: 'usuario',
    loadChildren: () =>
      import('@modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'programas',
    component: ContentLayoutComponent,
    canLoad: [UniversalGuard],
    loadChildren: () =>
      import('@modules/solicitud/solicitud.module').then((m) => m.SolicitudModule),
  },
  {
    path: 'documentos',
    component: ContentLayoutComponent,
    canLoad: [UniversalGuard],
    canActivateChild: [UniversalGuard],
    loadChildren: () =>
      import('@modules/documents/documents.module').then((m) => m.DocumentsModule),
  },
  {
    path: 'admin',
    component: ContentLayoutComponent,
    canLoad: [UniversalGuard],
    canActivateChild: [UniversalGuard],
    loadChildren: () =>
      import('@modules/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: 'ayuda',
    component: ContentLayoutComponent,
    canLoad: [UniversalGuard],
    canActivateChild: [UniversalGuard],
    loadChildren: () =>
      import('@modules/media/media.module').then((m) => m.MediaModule),
  },
  {
    path: 'peu',
    component: ContentLayoutComponent,
    canLoad: [UniversalGuard],
    loadChildren: () =>
      import('@modules/peu/peu.module').then(
        (m) => m.PeuModule
      ),
  },
  { path: '', redirectTo: 'usuario/login', pathMatch: 'full', },
  { path: '**', redirectTo: 'usuario/login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    useHash: true
}),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
