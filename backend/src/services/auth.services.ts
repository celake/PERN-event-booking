import { PublicUser } from '../types/user.types.js';
import { CreateUserInput, UserWithPassword } from '../types/auth.types.js';
import { query } from '../db/postgres.js';

export const createUser  = async (data: CreateUserInput): Promise<PublicUser> => {
    try {
        const sql = `
             INSERT INTO users (
                        first_name, 
                        last_name, 
                        email,
                        password_hash )
            VALUES ( $1, $2, $3, $4)
            RETURNING id, first_name, last_name, email
        `

        const result = await query<PublicUser>(sql, [data.first_name, data.last_name, data.email, data.password_hash]);

        return result.rows[0]; 
    } catch (error) {   
        console.error('Error creating user:', error);
        throw error;
    }
}

export const checkUserExists = async (email: string): Promise<number> => {
    try {
        const sql = `
            SELECT COUNT (*)
                FROM users 
                WHERE email = $1
        `
        const result = await query<{ count: string}>(sql, [email]);
        const count = parseInt(result.rows[0].count, 10);
        return count;
    } catch (error) {   
        console.error('Error fetching users:', error);
        throw error;
    }

}

export const userForValidation = async (email: string): Promise<UserWithPassword> => {
    try {
        const sql = `
            SELECT id, first_name, last_name, email, password_hash, role
                FROM users 
                WHERE email = $1
        `
        const result = await query<UserWithPassword>(sql, [email]);
        const user = result.rows[0];

        return user;
    } catch (error) {   
        console.error('Error fetching user with:', error);
        throw error;
    }

}
}
