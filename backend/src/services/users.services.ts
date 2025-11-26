import { PublicUser, UserRole } from '../types/user.types.js';
import { PublicEvent } from '../types/events.types.js';
import { query } from '../db/postgres.js';
import { DatabaseError } from '../lib/errors.js'

// export const getAllUsers = async (): Promise<PublicUser[]> => {
//     try {
//         const sql = `
//             SELECT id, first_name, last_name, email FROM users
//         `

//         const result = await query<PublicUser>(sql);

//         return result.rows; 
//     } catch (error) {   
//         console.error('Error fetching users:', error);
//         throw error;
//     }
// }

export const updateUserProfile = async (data: Record<string, string>, userId: number): Promise<PublicUser> => {
    try {
        const keys = Object.keys(data);
        const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        const values = Object.values(data);
        const sql = `
            UPDATE users
            SET ${setClauses}
            WHERE id = $${keys.length + 1}
            RETURNING id, first_name, last_name, email;
        `
        const result = await query<PublicUser>(sql, [...values, userId])
        return result.rows[0]
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }

}

export const getUserFromDb = async (userId: number): Promise<PublicUser> => {

    try {
        const sql = `
            SELECT first_name, last_name, email 
            FROM users
            WHERE id= $1;
        `
        const result = await query<PublicUser>(sql, [userId]);

        return result.rows[0]; 
    } catch (error) {   
        console.error('Error fetching users:', error);
        throw error;
    }

}

export const getUserRole =  async (userId: number): Promise<UserRole> => {
    try {
        const sql = `
            SELECT role 
            FROM users
            WHERE id= $1;
        `
        const result = await query(sql, [userId]);
        return result.rows[0].role; 
    } catch (error) {   
        console.error('Error fetching users:', error);
        throw error;
    }
}

export const deleteUser = async (userId: number): Promise<boolean> => {
    try {
        const sql = `
           DELETE FROM users
           WHERE id = $1;
        `
        const result = await query(sql, [userId]);
        if (!result || typeof result.rowCount !== "number") {
            console.log("Unexpected delete result: ", result)
            return false
        }

        return result.rowCount > 0; 
    } catch (error) {   
        console.error('DB error deleting user:', error);
        throw error;
    }

}

export const getFavoritesFromDb = async (userId: number): Promise<PublicEvent[]> => {
    try {
        const sql =`
            SELECT e.id, e.event, e.description, e.start_date, e.end_date, e.status
            FROM events e
            LEFT JOIN user_favorite_event ufe
            ON e.id = ufe.event_id
            WHERE ufe.user_id = $1;
        `

        const result = await query(sql, [userId]);
        return result.rows;

    } catch (error) {
        console.error('DB error getting favorites:', error);
        throw error;
    }
}

export const addFavoriteInDb = async (userId: number, eventId: number): Promise<void> => {
    try {
        const sql = `
            INSERT INTO user_favorite_event (user_id, event_id) 
            VALUES ($1, $2);
        `
        const result = await query(sql, [userId, eventId])
        if (!result || typeof result.rowCount !== "number") {
            throw new DatabaseError("Unexpected error adding favorite from db")
        }

        return; 
    } catch (error) {
        console.error('DB error setting favorites:', error);
        throw error;
    }
}

export const removeFavoriteInDb = async(userId: number, eventId: number): Promise<void> => {
    try {
        const sql = `
           DELETE FROM user_favorite_event
           WHERE user_id = $1 AND event_id = $2
        `
        const result = await query(sql, [userId, eventId]);
        if (!result || typeof result.rowCount !== "number") {
            throw new DatabaseError("Unexpected error removing favorite from db")
        }

        return;

    } catch (error) {
        console.error('DB error removing favorites:', error);
        throw error;
    }
}

