import {Component, NgModule, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Loader} from './loader/loader';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth-interceptor';
import {NavComponent} from './nav/nav';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Loader,
    NavComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})



export class App {
  protected readonly title = signal('lekham-plus');
}
