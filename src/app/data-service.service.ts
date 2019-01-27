import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as mock from '../mocks/videos';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(
    private http: HttpClient
  ) { }

  createHeader(headers: Headers) {
    headers.append('Access-Control-Allow-Origin', '*');
  }

  getVideo(id: string) {
    // return `https://static.chorus.ai/api/${id}.mp4`;
    // This checks the mock database if the video id exists or not
    if (mock.database.includes(id)) {
      return `https://static.chorus.ai/api/${id}.mp4`;
    } else {
      return 'not_found';
    }
  }

  getTranscript(id: string) {
    const headers = new Headers();
    this.createHeader(headers);
    return this.http.get(`https://static.chorus.ai/api/${id}.json`);
  }
}
