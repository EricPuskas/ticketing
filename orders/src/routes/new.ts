import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@epuskas-tickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { Order } from "../models/Order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 2 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    /**
     * Finds the ticket the user is trying to order in the database.
     */
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) throw new NotFoundError();

    /**
     * Makes sure that this ticked is not already reserved.
     */
    const isReserved = await ticket.isReserved();

    if (isReserved)
      throw new BadRequestError("This ticked is already reserved.");

    /**
     * Calculates an expiration date for the order.
     */
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    /**
     * Builds the order and save it to the database.
     */
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    /**
     * Publishes an event saying that the order was created.
     */
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: ticket.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
