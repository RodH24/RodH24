import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  apiKey: string = 'AIzaSyBuI7M8qtNnmNGwVQyDwhMaXGQK3Kulv08';

  constructor(public http: HttpClient) {}

  getVideosForChanel(channel: any, maxResults: any): Observable<any> {
    const headers = new HttpHeaders().set('noToken', 'true');
    let url =
      'https://www.googleapis.com/youtube/v3/search?key=' +
      this.apiKey +
      '&channelId=' +
      channel +
      '&order=date&part=snippet&type=video,id&maxResults=' +
      maxResults;
    return this.http.get(url, { headers }).pipe(
      map((res: any) => {
        return res.items;
      })
    );
  }
}
// https://www.googleapis.com/youtube/v3/search?key=AIzaSyBuI7M8qtNnmNGwVQyDwhMaXGQK3Kulv08&channelId=UCoHy33oo7Clc8JRx_j1g4IQ&order=date&part=snippet&playlistId=PLXAKcPmUC7nP7IV0Yo9ejtOdrnrNwyWsz
