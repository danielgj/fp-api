export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  lastActiveAt?: string;
  isPro: boolean;
  isAdmin: boolean;
  avatar?: string;
}
