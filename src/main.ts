import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AuthInterceptor} from './app/interceptor/auth-interceptor';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      withInterceptors([AuthInterceptor]) // ✅ register interceptor
    ),
    provideRouter(routes),
    ...appConfig.providers
  ]
}).catch(err => console.error(err));
