import {
  Publisher,
  Subjects,
  TickedUpdatedEvent,
} from "@epuskas-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TickedUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
