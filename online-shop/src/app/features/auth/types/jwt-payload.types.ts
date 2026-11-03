export interface JwtPayload {
  exp: number;
  iat: number;
  sub: string;
  scope: string;
}
