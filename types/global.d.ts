import { Main } from "./typechain";
import { MainInterface } from "./typechain/Main";

export {};

declare global {
  type OnchainEvent = Awaited<ReturnType<typeof Main.prototype.events>>;
  type OnchainEventTicket = Awaited<ReturnType<typeof Main.prototype.tickets>>;

  interface EventMetadata {
    name: string;
    description: string;
    image: string;
    attributes?: Array<object> | undefined;
  }

  interface EventTicketMetadata {
    name: string;
    description: string;
    image: string;
    attributes?: Array<object> | undefined;
  }
}
