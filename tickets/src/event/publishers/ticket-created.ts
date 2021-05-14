import {
  Publisher,
  Subjects,
  TickedCreatedEvent,
} from "@epuskas-tickets/common";

export class TicketCreatedPublisher extends Publisher<TickedCreatedEvent> {
  readonly subject = Subjects.TickedCreated;
}
