import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@epuskas-tickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { TicketUpdatedPublisher } from "../event/publishers/ticket-updated";
import { natsWrapper } from "../nats-wrapper";
import {
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
} from "@epuskas-tickets/common";
import mongoose from "mongoose";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required."),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new BadRequestError(
        "Please provide a valid id. Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
      );
    }

    const foundTicket = await Ticket.findById(req.params.id);

    if (!foundTicket) {
      throw new NotFoundError();
    }

    if (foundTicket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    if (foundTicket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    foundTicket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await foundTicket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: foundTicket.id,
      version: foundTicket.version,
      title: foundTicket.title,
      price: foundTicket.price,
      userId: foundTicket.userId,
    });

    res.send(foundTicket);
  }
);

export { router as updateTicketRouter };
