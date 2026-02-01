import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {AuthService} from '../services/auth';
import {Router} from '@angular/router';
import {JsonPipe, NgIf} from '@angular/common';
import {LoaderService} from '../services/loader';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf, JsonPipe],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private loader: LoaderService) {
    this.registerForm = this.fb.group({
      username: [''],
      email: [''],
      password: [''],
      phoneNumber: ['']
    });
  }

  register() {
    this.successMessage = '';
    this.errorMessage = '';
    const payload = this.registerForm.value;
    this.loader.show();
    this.authService.register(payload).subscribe({
      next: (res) => {
        if(res.success){
          alert("Successfully registered");
          this.registerForm.reset();
          this.router.navigate(['/login']);
        }
        this.loader.hide();
       console.log(res);
      },
      error: (err: any) => {
        this.loader.hide();
        this.errorMessage = err.message || 'Something went wrong';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
