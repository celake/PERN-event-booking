export type UserRole = 'user' | 'organizer';

export interface PublicUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface UpdateUser {
    id: number;
    first_name?: string;
    last_name?: string;
    email?: string;
}