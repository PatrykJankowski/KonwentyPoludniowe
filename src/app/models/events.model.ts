export interface Events {
    id: number;
    name: string;
    event_type: string;
    location: string;
    image: string;
    date_begin: string;
}

export interface EventDetails extends Events {
    address: string;
    description: string;
}
