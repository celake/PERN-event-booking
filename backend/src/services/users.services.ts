import { UserRole, PublicUser, UpdateUser } from '../types/user.types.js';
import { query } from '../db/postgres.js';

export const getAllUsers = async (): Promise<PublicUser[]> => {
    try {
        const sql = `
            SELECT first_name, last_name, email FROM users
        `

        const result = await query<PublicUser>(sql);

        return result.rows; 
    } catch (error) {   
        console.error('Error fetching users:', error);
        throw error;
    }
}


export const updateUserProfile = async (data: string[], userId: number): Promise<UpdateUser> => {
    try {
        const sql = `
            UPDATE users
            SET ${data.join(', ')}
            WHERE id: ${userId};
        `
    } catch (error) {
        console.error('Error updating:', error);
        throw error;
    }

    return 
}