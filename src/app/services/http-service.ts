import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly http = inject(HttpClient);

  get<T = any>(url: string): Observable<T> {
    return this.http.get<T>(url, {
      responseType: 'text' as 'json' // Handles plain text from server
    });
  }


  post<T = any>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data, {
      responseType: 'text' as 'json' // Change if server sends JSON
    });
  }


  // getSecured<T = any>(endpoint: string): Observable<T> {
  //   return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
  //     headers: this.getAuthHeaders(),
  //     responseType: 'text' as 'json'
  //   });
  // }

  getSecured<T = any>(url: string): Observable<T> {
    return this.http.get<T>(url, {
      headers: this.getAuthHeaders()
    });
  }

  postSecured<T = any>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data, {
      headers: this.getAuthHeaders(),
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token ?? ''}`,
      'Content-Type': 'application/json'
    });
  }
}

