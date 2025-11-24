export interface Locations {
    name: string;
    street_address: string;
    city: string;
    postcode: string;
    country: string;
    additional_locator: string;
}

export interface NewLocation {
    name?: string;
    street_address: string;
    city: string;
    postcode: string;
    country?: string;
    additional_locator?: string;
}

export interface LocationSearchQuery {
    name?: string;
    city?: string;
    country?: string;
    postcode?: string;
    street_address?: string;
}