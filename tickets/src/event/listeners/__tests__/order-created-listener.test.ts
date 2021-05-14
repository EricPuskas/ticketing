import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { OrderCreatedEvent, OrderStatus } from "@epuskas-tickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";

const setup = async () => {
  /**
   * Creates an instance of the listener
   */
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "Concert",
    price: 99,
    userId: "asdf",
  });

  await ticket.save();

  /**
   * Creates a fake data event
   */
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  /**
   * Creates a fake message object
   */
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("sets the orderId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acknowledges the message", async () => {
  const { listener, data, msg } = await setup();

  /**
   * Calls the onMessage function with the data object + message object
   */
  await listener.onMessage(data, msg);

  /**
   * Write assertions to make sure ack function is called
   */
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
