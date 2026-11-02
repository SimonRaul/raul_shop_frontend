import { AuthActions } from './auth.actions';
import { AuthState, authFeature } from './auth.reducers';
import { User } from '../../../features/shared/types/users.types';

const { reducer } = authFeature;

describe('authReducer', () => {
  const user: User = {
    id: 'user-1',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    username: 'jane',
    role: 'CUSTOMER',
  };

  let initialState: AuthState;

  beforeEach(() => {
    initialState = reducer(undefined, { type: '@@init' });
  });

  it('returns the initial state', () => {
    expect(initialState).toEqual({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,
      error: null,
    });
  });

  it('updates authentication state for login and session actions', () => {
    let state = reducer(
      initialState,
      AuthActions.login({ request: { username: 'jane', password: 'password' } }),
    );
    expect(state).toMatchObject({ isLoading: true, error: null });

    state = reducer(state, AuthActions.loginSuccess({ user, token: 'token' }));
    expect(state).toEqual({
      user,
      token: 'token',
      isLoading: false,
      isInitialized: true,
      error: null,
    });

    state = reducer(state, AuthActions.loginFailure({ error: 'Invalid credentials' }));
    expect(state).toEqual({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: true,
      error: 'Invalid credentials',
    });

    state = reducer(state, AuthActions.validateSession());
    expect(state).toMatchObject({ isLoading: true, error: null });
    state = reducer(state, AuthActions.sessionValid({ user, token: 'new-token' }));
    expect(state).toMatchObject({ user, token: 'new-token', isInitialized: true });

    state = reducer(state, AuthActions.sessionInvalid());
    expect(state).toEqual({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  });

  it('clears authentication state on logout', () => {
    const state = reducer(
      { ...initialState, user, token: 'token' },
      AuthActions.logout(),
    );

    expect(state).toEqual({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  });
});
