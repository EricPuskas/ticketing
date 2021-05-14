import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@epuskas-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
