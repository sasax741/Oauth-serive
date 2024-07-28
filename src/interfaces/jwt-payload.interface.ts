export interface JwtPayload {
    aud: string;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    nbf: number;
    sub: number;
  }
  