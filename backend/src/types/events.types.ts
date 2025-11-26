export type EventStatus = 'open' | 'closed' | 'paused';

export interface PublicEvent {
    id: number;
    event: string;
    start_date: Date;
    city: string;
    country: string;
}

export interface EventDetail {
    id: number;
    organizer_id: number;
    event: string;
    start_date: Date;
    end_date: Date;
    status: EventStatus;
    description: string;
    street_address: string;
    city: string;
    post_code: string;
    additional_locator: string;
    country: string;
}

export interface NewEventInput {
    event: string;
    start_date: Date;
    end_date: Date;
    description?: string;
    location?: number
}

