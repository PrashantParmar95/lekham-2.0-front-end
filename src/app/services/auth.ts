import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import {HttpService} from './http-service';
import {API_ENDPOINTS} from '../constants/endpoints';

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

  constructor(private http: HttpClient,private httpService: HttpService) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyOtp(email: string, otp: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN_OTP, { email, otp })
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


  refreshToken(): Observable<LoginResponse> {
    return this.httpService.postSecured<LoginResponse>(API_ENDPOINTS.AUTH.REFRESH,null)
      .pipe(
        catchError(this.handleError)
      );
  }


  register(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.USER.REGISTER, request)
      .pipe(
        catchError(this.handleError)
      );
  }

}
