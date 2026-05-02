import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/shared/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/shared/app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
}).catch((err) => console.error(err));
