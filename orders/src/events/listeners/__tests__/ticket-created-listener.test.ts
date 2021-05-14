import { TicketCreatedListener } from "../ticket-created-listener";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { TickedCreatedEvent } from "@epuskas-tickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";

const setup = async () => {
  /**
   * Creates an instance of the listener
   */
  const listener = new TicketCreatedListener(natsWrapper.client);

  /**
   * Creates a fake data event
   */
  const data: TickedCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "Concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  /**
   * Creates a fake message object
   */
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  /**
   * Calls the onMessage function with the data object + message object
   */
  await listener.onMessage(data, msg);

  /**
   * Write assertions to make sure a ticket was created!
   */
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
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
