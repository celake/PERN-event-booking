import { UserRole } from "./user.types.js"

export interface CreateUserInput {
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role?: UserRole; // optional because default is 'user'
}

export interface UserWithPassword {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    role: UserRole;
}

