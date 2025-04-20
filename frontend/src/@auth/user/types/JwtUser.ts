export type JwtUser = {
    email: string;
    name: string; // This will be mapped to displayName in `User`
    role: string | string[];
  };