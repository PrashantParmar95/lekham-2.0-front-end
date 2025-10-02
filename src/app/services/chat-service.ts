import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseUrl = 'http://lekham-plus';

  constructor(private http: HttpClient) {}

  getWelcomeMessage() {
    this.http.get(`${this.baseUrl}/welcome`,{
      responseType: 'text'
    })
      .subscribe(res => {
        console.log(res);
      },error => {
        console.log(error);
      })
  }
}
