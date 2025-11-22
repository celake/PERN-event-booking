export type NotificationStatus = 'draft' | 'sent'

export interface EventNotification {
    id: number;
    event: string;
    subject: string;
    created_at: Date;
}                      

export interface UserNotifications extends EventNotification {
    is_read: boolean;
}

export interface OrganizerNotifications extends EventNotification {
    status: NotificationStatus;
}

export interface newNotification {
    id: number;
    sender_id: number;
    event_id: number;
    message: string;
}