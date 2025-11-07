export type EventStatus = 'open' | 'closed' | 'paused';

export interface PublicEvent {
    id: number;
    event: string;
    start_date: Date;
    end_date: Date;
    status: EventStatus;
    description: string;
}