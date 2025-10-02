import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

interface LoginRequest {
  email: string;
  password?: string;
  otp_login?: boolean;
}

interface LoginResponse {
  success: boolean;
  message: string | null;
  error: string | null;
  timestamp: string;
  status: string;
  data: {
    token: string;
    user: {
      username: string;
      email: string;
      userBio: string;
      phoneNumber: string;
    };
  } | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://lekham-plus/auth';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyOtp(email: string, otp: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login-otp`, { email, otp })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'Something went wrong!';
    if (error.error && error.error.error) {
      errorMsg = error.error.error;
    }
    return throwError(() => new Error(errorMsg));
  }
}
