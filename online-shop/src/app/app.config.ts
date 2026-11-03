import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { tokenInterceptor } from './core/interceptors/token-interceptor';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authFeature } from './features/auth/state/auth.reducers';
import { productsFeature } from './features/products/state/products.reducers';
import { AuthEffects } from './features/auth/state/auth.effects';
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
