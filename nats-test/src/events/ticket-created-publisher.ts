import { Publisher } from "./base-publisher";
import { TickedCreatedEvent } from "./ticked-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedPublisher extends Publisher<TickedCreatedEvent> {
  readonly subject = Subjects.TickedCreated;
}
