import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    return `https://static.chorus.ai/api/${id}.mp4`;
  }

  getTranscript(id: string) {
    const headers = new Headers();
    this.createHeader(headers);
    return this.http.get(`https://static.chorus.ai/api/${id}.json`);
  }
}
