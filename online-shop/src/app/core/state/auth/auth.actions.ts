import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User, UserLoginRequest } from '../../../features/shared/types/users.types';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ request: UserLoginRequest }>(),
    Logout: emptyProps(),
    'Validate Session': emptyProps(),
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure': props<{ error: string }>(),
    'Session Valid': props<{ user: User; token: string }>(),
    'Session Invalid': emptyProps(),
  },
});
