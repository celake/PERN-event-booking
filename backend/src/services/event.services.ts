import { PublicEvent, EventDetail, NewEventInput} from '../types/events.types.js';
import { EventNotification } from '../types/notification.types.js';
import { PublicUser } from '../types/user.types.js';
import { query } from '../db/postgres.js';

export const getOpenEvents = async (): Promise<PublicEvent[]> => {
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

export const eventDetails = async (eventId: number): Promise<EventDetail> => {
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
        return result.rows[0];
    } catch (error) {
        console.error('DB error fetching events:', error);
        throw error;
    }
}


export const addEvent = async (data: NewEventInput): Promise<number> => {
    try {
        const keys = Object.keys(data);
        const setColumns = keys.join(', ');
        const values = Object.values(data);
        const setValues = values.map(value => `'${value}'`).join(', ');
        const sql =`
            INSERT INTO events (${setColumns})
            VALUES (${setValues})
            RETURNING id
        `
        console.log(sql)
        const result = await query(sql);
        return result.rows[0];
     } catch (error) {
        console.error('DB error creating new event:', error);
        throw error;
    }
}
export const updateEventDB = async (data: Record<string, string>, eventId: number): Promise<EventDetail>=> {
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

        const updatedEvent = await eventDetails(result.rows[0].id)
        return updatedEvent
    } catch (error) {
        console.error('DB error Updating event:', error);
        throw error;
    }
}

export const addEventRSVP = async (userId: number, eventId: number): Promise<boolean> {
    try {
        const sql =`
            INSERT INTO event_users
            (user_id, event_id)
            VALUES ($1, $2)
        `
        const result = await query(sql, [userId, eventId])

        return (result.rowCount ?? 0) > 0
    } catch (error) {
        console.error('DB error adding rsvp:', error);
        throw error;
    }
}

export const removeEventRSVP = async (userId: number, eventId: number): Promise<boolean> {
    try {
        const sql =`
            DELETE FROM event_users
            WHERE user_id = $1 AND event_id = $2;
        `
        const result = await query(sql, [userId, eventId])

        return (result.rowCount ?? 0) > 0
    } catch (error) {
        console.error('DB error removing rsvp:', error);
        throw error;
    }
}


export const eventAttendees = async (eventId: number): Promise<PublicUser[]> {
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