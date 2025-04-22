import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { httpInterceptorProvider } from './app/app.config';
import { ReactiveFormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // 👈 подключаем интерсепторы из DI
    ...httpInterceptorProvider, // 👈 регистрируем сам AuthInterceptor
    importProvidersFrom(ReactiveFormsModule)
  ]
});