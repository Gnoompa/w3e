declare global {
    interface EventMetadata {
        name: string;
        description?: string;
        image?: string;
        attributes?: Array<object> | undefined
    }

    interface EventTicketMetadata {
        name: string;
        description?: string;
        image?: string;
        attributes?: Array<object> | undefined
    }
}
