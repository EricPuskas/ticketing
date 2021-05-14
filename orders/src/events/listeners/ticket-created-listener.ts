import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TickedCreatedEvent,
} from "@epuskas-tickets/common";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TickedCreatedEvent> {
  readonly subject = Subjects.TickedCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TickedCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
