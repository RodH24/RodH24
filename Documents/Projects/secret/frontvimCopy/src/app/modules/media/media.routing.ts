import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YoutubeComponent } from './views/youtube/youtube.component';

/**
 *  @Route
 *  PEU Route.
 *  Show the peu components
 *  Only can be accessed by __________ users
 **/
const routes: Routes = [
  {
    path: 'videos',
    component: YoutubeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaRoutingModule {}
