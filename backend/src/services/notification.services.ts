import { UserNotifications, OrganizerNotifications, NotificationStatus } from "../types/notification.types.js";
import { ConflictError,
         DatabaseError,
         ValidationError,
         NotFoundError
 } from "../lib/errors.js";
import { UserRole } from "../types/user.types.js";
import { getUserRole } from '../services/users.services.js';
import { query } from "../db/postgres.js";

export const getUserEventNotifications = async (userId: number): Promise<UserNotifications[]>  => {
    try {
        const sql =`
                SELECT e.event, n.subject, n.created_at, nu.is_read
                FROM notifications n
                INNER JOIN events e ON e.id = n.event_id
                INNER JOIN notification_users nu ON nu.notification_id = n.id
                WHERE nu.user_id = $1;
            `
        const result = await query(sql, [userId])

        return result.rows;

    } catch (error) {
        console.error('DB error fetching user event notifications:', error);
        throw error;
    }
}

export const getOrganizerEventNotifications = async (userId: number): Promise<OrganizerNotifications[]> => {
    try {
        const sql =`
                SELECT e.event, n.subject, n.created_at, n.status
                FROM notifications n
                INNER JOIN events e ON e.id = n.event_id
                WHERE n.sender_id = $1 AND n.deleted_by_organizer = $2;
            `
        const result = await query(sql, [userId, false])
        
        return result.rows;

    } catch (error) {
        console.error('DB error fetching organizer event notifications:', error);
        throw error;
    }
}

export const getNotificationDetailsFromDb = async (notificationId: number, userId: number): Promise<UserNotifications> => {
    try {
        const sql=`
            SELECT e.event, n.subject, n.message, n.created_at
                FROM notifications n
                INNER JOIN events e ON e.id = n.event_id
                WHERE n.id = $1;
        `

        const result = await query(sql, [notificationId])
        console.log(result.rows[0])
        if ((result.rowCount || 0) < 1) {
            throw new NotFoundError('Notification not found');
        }

        const isRead = await setReadStatus(notificationId, userId);
        if (!isRead) {
            throw new DatabaseError('Failed to set status to read.')
        }

        return {...result.rows[0], is_read: isRead};
    } catch (error) {
        console.error('DB error fetching notification details:', error);
        throw error;
    }
}

export const saveNotificationToDB = async (eventId: number, senderId: number, subject: string, message: string): Promise<boolean> => {
    try {
        const sql = `
            INSERT INTO notifications (sender_id, event_id, subject, message)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `;

        const result = await query(sql, [senderId, eventId, subject, message])
        const success = (result.rowCount === 1)

        if  (!success) {
            throw new DatabaseError("Failure to save notification to database")
        }
        return success;

    } catch (error) {
        console.error('DB error saving event notification:', error);
        throw error;
    }
}

export const sendNotificationToUsers = async (notificationId: number): Promise<number> => {
    try {
        // check if notification is able to be sent
        const status = await checkNotificationStatus(notificationId);
        if (status === "sent") {
            throw new ConflictError('Notification already sent');
        }

        // get list of users RSVPd to the event and create string for query
        const eventId: number = await getNotificationEvent(notificationId);
        const getUsersSQL = `
            SELECT user_id 
                FROM event_users
                WHERE event_id = $1;
            `
        const users = await query(getUsersSQL, [eventId]);
        const values = users.rows.map(row => `(${notificationId}, ${row.user_id})`).join(", ")
        // insert row into notification_users for each user_id and notification_id
        const sendSQL = `
            INSERT INTO notification_users (notification_id, user_id)
                VALUES ${values};
        `
        const result = await query(sendSQL);
        if (result.rowCount !== users.rows.length) {
            throw new DatabaseError('Failed to insert notification recipients');
        }
        // set sent status and time
        const sentStatus = setSentStatus(notificationId);
        if (!sentStatus) {
            throw new DatabaseError('Failed to update notification status and sent time');
        }
        return result.rowCount;
        
    } catch (error) {
        console.error('DB error sending event notification:', error);
        throw error;
    }
}

export const updateNotificationInDb = async (event_id: number, subject: string, message: string, notificationId: number): Promise<number> => {
    try {
        const sql = `
            UPDATE notifications
                SET event_id = $1, subject = $2, message = $3
                WHERE id = $4
                RETURNING id;
        `

        const result = await query(sql, [event_id, subject, message, notificationId])
        if ((result.rowCount || 0) < 1) {
            throw new DatabaseError("Failed to update notification")
        }
        return result.rows[0].id;

    } catch (error) {
        console.error('DB error updating notification:', error);
        throw error;
    }
}

export const toggleReadStatus = async (notificationId: number, userId: number): Promise<boolean> => {
    try {
        console.log("toggle read service function")
        const sql = `
            UPDATE notification_users
            SET is_read = NOT is_read
            WHERE notification_id = $1 AND user_id = $2
            RETURNING notification_id;
        `

        const result = await query(sql, [notificationId, userId]);
        if ((result.rowCount || 0) < 0) {
            throw new DatabaseError("Failed to toggle is_read state")
        }

        return result.rows[0].notification_id;
    } catch (error) {
        console.error('DB error toggling is_read:', error);
        throw error;
    }
}

export const deleteUserNotificationFromDB = async (notificationId: number, userId: number): Promise<number> => {
    try {
        const sql=`
            DELETE FROM notification_users
                WHERE notification_id = $1 AND user_id = $2
                RETURNING notification_id;
        `
        const result = await query(sql, [notificationId, userId]);
        if ((result.rowCount || 0) < 1) {
            throw new DatabaseError("Notification not found")
        }
        return result.rows[0].notificationId;
    } catch (error) {
        console.error('DB error deleting notification:', error);
        throw error;
    }
}

export const deleteDraftNotificationFromDB = async (notificationId: number, userId:number): Promise<number> => {
    try {
        const sql =`
            UPDATE notifications
                SET deleted_by_organizer = true
                WHERE id = $1 AND sender_id = $2
                RETURNING id;
        `
        const result = await query(sql , [notificationId, userId]);

        if ((result.rowCount || 0) < 1) {
            throw new DatabaseError("Notification not found")
        }
        return result.rows[0].id;
    } catch (error) {
        console.error('DB error deleting draft:', error);
        throw error;
    }
}

//Helper functions

export const checkNotificationStatus = async (notificationId: number): Promise<NotificationStatus> => {
    try {   
        const sql =`
            SELECT status 
                FROM notifications
                WHERE id = $1
        `
        const result = await query(sql, [notificationId]);
        if (result.rows[0].status === 'sent') {
            throw new ValidationError('Notification has been sent and cannot be modified')
        }
        return result.rows[0].status;
        
    } catch (error) {
        console.error('DB error checkkng notification status:', error);
        throw error;
    }
}

export const getNotificationEvent = async (notificationId: number): Promise<number> => {
    try {
        const sql = `
            SELECT event_id 
                FROM notifications
                WHERE id = $1;
        `
        const result = await query(sql, [notificationId]);

        return result.rows[0].event_id;
    } catch (error) {
        console.error('DB error fetching notification event Id:', error);
        throw error;
    }
}

export const setSentStatus = async (notificationId: number): Promise<boolean> => {

    try {
        const sql =`
            UPDATE notifications
                SET status = 'sent', sent_at = NOW()
                WHERE id = $1;
        `
        const result = await query(sql, [notificationId]);

        return result.rowCount === 1;
    } catch (error) {
        console.error('DB error setting notification status to sent:', error);
        throw error;
    }
}


export const setReadStatus = async (notificationId: number, userId: number): Promise<boolean> => {

    try {
        const sql =`
            UPDATE notification_users
                SET is_read = true
                WHERE user_id = $1 AND notification_id = $2;
        `

        const result = await query(sql, [userId, notificationId]);
        console.log(result)
        if ((result.rowCount || 0) < 1) {
            throw new DatabaseError('Failed to set read status');
        }
        return result.rowCount === 1;
    } catch (error) {
        console.error('DB error setting notification is_read status to read:', error);
        throw error;
    }
}

