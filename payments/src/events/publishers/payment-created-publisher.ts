import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@epuskas-tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
