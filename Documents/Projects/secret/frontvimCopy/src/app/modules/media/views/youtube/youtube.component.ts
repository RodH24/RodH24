import { Component, OnInit } from '@angular/core';
import { YoutubeService } from '@core/services/media/youtube.service';
import { takeUntil } from 'rxjs-compat/operator/takeUntil';
import { map, startWith } from "rxjs/operators";

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.scss']
})
export class YoutubeComponent implements OnInit {

  public video_list: Array<any> = [];
  unsubscribe: any;

  constructor(private youTubeService: YoutubeService) { }

  ngOnInit(): void {
    this.listYoutubeVideos();
  }

  public listYoutubeVideos() {
    // this.youTubeService.getVideosForChanel('UCoHy33oo7Clc8JRx_j1g4IQ', 15)
    //   .subscribe((lista: any) => {
    //     for (let element of lista["items"]) {
    //       this.videos.push(element)
    //     }
    //   });
    this.youTubeService.getVideosForChanel('UCoHy33oo7Clc8JRx_j1g4IQ', 15).subscribe((items: any) => {
        this.video_list = items
      });
  }
}
