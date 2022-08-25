import { Main } from "./typechain";
import { MainInterface } from "./typechain/Main";

export {};

declare global {
  type OnchainEvent = Awaited<ReturnType<typeof Main.prototype.getEvents>>[1];

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
