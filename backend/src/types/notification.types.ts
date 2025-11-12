export type NotificationStatus = 'draft' | 'sent'

export interface EventNotification {
    event_id: number;
    message: string;
    status: NotificationStatus;
}