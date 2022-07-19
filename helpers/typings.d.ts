interface TickeroEventMetadata {
    name: string;
    description?: string;
    image?: string;
    attributes?: Array<object> | undefined
}

interface TickeroEvent {
    beneficiary: string;
    organizer: string;
    isSubscription: boolean;
    ticketPrice: string;
    ticketSupply: string;
    isInfiniteTicketSupply: boolean;
}
