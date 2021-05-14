import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { TickedUpdatedEvent } from "@epuskas-tickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";

const setup = async () => {
  /**
   * Creates an instance of the listener
   */
  const listener = new TicketUpdatedListener(natsWrapper.client);

  /**
   * Creates and saves a ticket
   */
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Concert",
    price: 10,
  });

  await ticket.save();

  /**
   * Creates a fake data object
   */
  const data: TickedUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: "test_1923912030",
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

it("finds, updates and saves a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  /**
   * Calls the onMessage function with the data object + message object
   */
  await listener.onMessage(data, msg);

  /**
   * Write assertions to make sure a ticket was created!
   */
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
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

it("does not call ack if the event has a skipped version number", async () => {
  const { listener, data, msg, ticket } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
