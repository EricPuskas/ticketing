import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";
import { TickedCreatedEvent } from "./ticked-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TickedCreatedEvent> {
  readonly subject = Subjects.TickedCreated;
  queueGroupName = "payments-service";

  onMessage(data: TickedCreatedEvent["data"], msg: Message) {
    console.log("onMessage:", data);

    msg.ack();
  }
}
