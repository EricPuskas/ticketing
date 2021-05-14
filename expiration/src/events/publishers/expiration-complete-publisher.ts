import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@epuskas-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
