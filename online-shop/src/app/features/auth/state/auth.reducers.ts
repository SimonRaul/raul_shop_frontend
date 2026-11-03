import { User } from '../../user/types/users.types';
import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialAuthState,

    on(AuthActions.login, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AuthActions.validateSession, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(AuthActions.loginSuccess, (state, { user, token }) => ({
      ...state,
      user,
      token,
      isLoading: false,
      isInitialized: true,
      error: null,
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      user: null,
      token: null,
      isLoading: false,
      isInitialized: true,
      error,
    })),
    on(AuthActions.logout, AuthActions.sessionInvalid, (state) => ({
      ...state,
      user: null,
      token: null,
      isLoading: false,
      isInitialized: true,
      error: null,
    })),
    on(AuthActions.sessionValid, (state, { user, token }) => ({
      ...state,
      user,
      token,
      isLoading: false,
      isInitialized: true,
      error: null,
    })),
  ),
});

export const {
  name,
  reducer,
  selectAuthState,
  selectUser,
  selectToken,
  selectIsLoading,
  selectIsInitialized,
  selectError,
} = authFeature;
