export interface Token {
  iss: string;
  iat: number;
  exp: number;
  sub: string;
  oid: string;
  name: string;
  preferred_username: string;
  family_name: string;
  given_name: string;
  roles: string[];
}
