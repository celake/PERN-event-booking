import { PublicEvent, EventDetail, NewEventInput} from '../types/events.types.js';
import { PublicUser } from '../types/user.types.js';
import { query, pool } from '../db/postgres.js';
import { DatabaseError, NotFoundError } from '../lib/errors.js';

export const getOpenEventsFromDb = async (): Promise<PublicEvent[]> => {
    try {
        const sql =`
            SELECT e.id, e.event, e.start_date, l.city, l.country
            FROM events e
            LEFT JOIN locations l ON e.location_id = l.id
            WHERE e.status = $1;
        `;
        const result = await query<PublicEvent>(sql, ["open"])
        return result.rows;
    } catch (error) {
        console.error('DB error fetching events:', error);
        throw error;
    }
}

export const getEventDetailsFromDb = async (eventId: number): Promise<EventDetail> => {
    try {
        const sql =`
            SELECT e.id, 
                   e.event, 
                   e.start_date, 
                   e.end_date, 
                   e.status, 
                   e.description, 
                   l.street_address,
                   l.city, 
                   l.postcode,
                   l.additional_locator,
                   l.country
            FROM events e
            LEFT JOIN locations l ON e.location_id = l.id
            WHERE e.id = $1;
        `;
        const result = await query<EventDetail>(sql, [eventId])

        if ((result.rowCount || 0) < 1) {
            throw new NotFoundError("Event not found");
        }
        return result.rows[0];
    } catch (error) {
        console.error('DB error fetching events:', error);
        throw error;
    }
}


export const addEventInDb = async (data: NewEventInput, userId: number): Promise<number> => {
    const client = await pool.connect();
    try {
        const keys = Object.keys(data);
        const setColumns = keys.join(', ');
        const values = Object.values(data);
        const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
        const eventSql =`
            INSERT INTO events (${setColumns})
            VALUES (${placeholders})
            RETURNING id;
        `
        const orgSql = `
            INSERT INTO event_organizers (event_id, user_id)
                VALUES ($1, $2);
        `

        await client.query("BEGIN")
        
        const newEvent = await client.query<{ id: number }>(eventSql, [...values]);
        await client.query(orgSql, [newEvent.rows[0].id, userId]);

        await client.query("COMMIT");

        return newEvent.rows[0].id;
     } catch (error) {
        await client.query("ROLLBACK");
        console.error("Failed to create new event", error)
        throw error;
    } finally {
        client.release();
    }
}
export const updateEventInDb = async (data: Record<string, string>, eventId: number): Promise<EventDetail> => {
    try {
        const keys = Object.keys(data);
        const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        const values = Object.values(data);
        const sql = `
            UPDATE events
            SET ${setClauses}
            WHERE id = $${keys.length + 1}
            RETURNING id;
        `
        const result = await query<PublicEvent>(sql, [...values, eventId])

        if ((result.rowCount || 0) < 1) {
            throw new DatabaseError("Failed to update event data");
        }
        const updatedEvent = await getEventDetailsFromDb(result.rows[0].id)
        return updatedEvent
    } catch (error) {
        console.error('DB error Updating event:', error);
        throw error;
    }
}

export const addEventRsvpInDb = async (userId: number, eventId: number): Promise<boolean> => {
    try {
        const sql =`
            INSERT INTO event_users
            (user_id, event_id)
            VALUES ($1, $2)
            RETURNING event_id;
        `
        const result = await query(sql, [userId, eventId])

        if ((result.rowCount || 0) < 1) {
            throw new DatabaseError("Failed to add rsvp for event");
        }
        return (result.rowCount ?? 0) > 0
    } catch (error) {
        console.error('DB error adding rsvp:', error);
        throw error;
    }
}

export const removeEventRsvpInDb = async (userId: number, eventId: number): Promise<boolean> => {
    try {
        const sql =`
            DELETE FROM event_users
            WHERE user_id = $1 AND event_id = $2;
        `
        const result = await query(sql, [userId, eventId])
        if ((result.rowCount || 0) < 1) {
            throw new DatabaseError("Failed to remove rsvp for event");
        }

        return (result.rowCount ?? 0) > 0
    } catch (error) {
        console.error('DB error removing rsvp:', error);
        throw error;
    }
}


export const eventAttendeesFromDB = async (eventId: number): Promise<PublicUser[]> => {
    try {
        const sql = `
            SELECT user_id, first_name, last_name, email 
            FROM users u
            JOIN event_users eu ON u.id = eu.user_id
            WHERE eu.event_id = $1;
        `
        const result = await query(sql, [eventId]);
        return result.rows;
    } catch (error) {
        console.error('DB error fetching event attendees:', error);
        throw error;
    }
}

export const eventAttendeesCountFromDB = async (eventId: number): Promise<number> => {
    try {
        const sql = `
            SELECT COUNT(user_id) as attendees  
                FROM event_users
                GROUP BY event_id
                HAVING event_id = $1;
        `
        const count = await query(sql,[eventId]);
        return count.rows[0].attendees;
    } catch (error) {
         console.error('DB error fetching event attendee count:', error);
        throw error;
    }
}

export const getEventOrganizers = async (eventId: number): Promise<number[]> => {
    try {
        const sql = `
            SELECT user_id 
                FROM event_organizers
                WHERE event_id = $1;
        `

        const result = await query(sql, [eventId]);
        const organizers = result.rows.map(row => row.user_id)
        return organizers;
    } catch (error) {
         console.error('DB error fetching event Organizers:', error);
        throw error;
    }
}