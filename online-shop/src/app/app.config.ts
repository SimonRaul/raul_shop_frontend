import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { tokenInterceptor } from './interceptors/token-interceptor';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authFeature } from './core/state/auth/auth.reducers';
import { productsFeature } from './features/products/state/products.reducers';
import { AuthEffects } from './core/state/auth/auth.effects';
import { ProductsEffects } from './features/products/state/products.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, tokenInterceptor])),
    provideStore(),
    provideState(authFeature),
    provideState(productsFeature),
    provideEffects([AuthEffects, ProductsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), name: 'Online-Shop-App' }),
  ],
};
