export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}
export const USER_ROLES: UserRole[] = Object.values(UserRole);

export function hasUserRole(user: User | null, role: UserRole): boolean {
  return user?.role.replace(/^ROLE_/, '') === role;
}
