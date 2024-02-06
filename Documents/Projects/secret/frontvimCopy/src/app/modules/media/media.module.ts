import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MediaRoutingModule } from './media.routing';
import { YoutubeComponent } from './views/youtube/youtube.component';

@NgModule({
  declarations: [
    YoutubeComponent
  ],
  imports: [ MediaRoutingModule, SharedModule ]
})
export class MediaModule {}
