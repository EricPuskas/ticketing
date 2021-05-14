import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@epuskas-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
