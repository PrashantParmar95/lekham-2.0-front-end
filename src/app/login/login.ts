import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../services/auth';
import {NgIf} from '@angular/common';
import {LoaderService} from '../services/loader';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [ReactiveFormsModule, NgIf, FormsModule],
  standalone: true
})
export class LoginComponent {
  loginForm: FormGroup;
  otpForm: FormGroup;
  useOtp: boolean = false;       // toggle between password/OTP login
  showOtpInput: boolean = false; // show OTP input page
  errorMessage: string = '';
  successMessage: string = '';
  private token: string | null | undefined;

  constructor(private fb: FormBuilder, private authService: AuthService, private loader: LoaderService, private router: Router) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });

    this.otpForm = this.fb.group({
      otp: ['']
    });

    this.validatetoken();
  }

  toggleLoginMode() {
    this.useOtp = !this.useOtp;
    this.showOtpInput = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.loginForm.reset();
    this.otpForm.reset();
  }

  login() {
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.loader.show();
    if (this.useOtp) {

      this.authService.login({email, password: '', otp_login: true}).subscribe({
        next: (res) => {
          this.loader.hide();
          if (res.success) {
            this.showOtpInput = true; // go to OTP input page
          } else {
            this.errorMessage = res.error || 'Invalid login';
          }
        },
        error: (err: any) => {
          this.loader.hide();
          this.errorMessage = err.message
        }

      });
    } else {
      // Password login
      this.authService.login({email, password, otp_login: false}).subscribe({
        next: (res) => {
          this.loader.hide();
          if (res.success) {
            this.successMessage = `Welcome, ${res.data?.user.username}`;
            localStorage.setItem('token', res.data?.token || '');
            this.router.navigate(['/categories']);
          } else {
            this.errorMessage = res.error || 'Invalid login';
          }
        },
        error: (err: any) => {
          this.loader.hide();
          this.errorMessage = err.message
        }
      });
    }
  }

  verifyOtp() {
    const otp = this.otpForm.value.otp;
    const username = this.loginForm.value.email;
    this.loader.show();
    this.authService.verifyOtp(username, otp).subscribe({
      next: (res) => {
        this.loader.hide();
        if (res.success) {
          this.router.navigate(['/categories']);
          this.successMessage = `Welcome, ${res.data?.user.username}`;
          this.errorMessage = '';
          localStorage.setItem('token', res.data?.token || '');
        } else {
          this.errorMessage = res.error || 'Invalid OTP';
        }
      },
      error: (err: any) => {
        this.loader.hide();
        this.errorMessage = err.message
      }
    });
  }


  validatetoken(){
    this.loader.show();
    this.authService.refreshToken().subscribe({
      next: (res) => {
        this.loader.hide();
        if (res.success) {
          this.router.navigate(['/categories']);
          this.successMessage = `Welcome, ${res.data?.user.username}`;
          this.errorMessage = '';
          localStorage.setItem('token', res.data?.token || '');
        } else {
          this.errorMessage = res.error || 'Invalid Token';
        }
      },
      error: (err: any) => {
        this.loader.hide();
        //this.errorMessage = err.message
      }
    });
  }
}
