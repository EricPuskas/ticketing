import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@epuskas-tickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { NotFoundError, BadRequestError } from "@epuskas-tickets/common";
import mongoose from "mongoose";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw new BadRequestError(
      "Please provide a valid id. Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
    );
  }

  const foundTicket = await Ticket.findById(req.params.id);

  if (!foundTicket) {
    throw new NotFoundError();
  }

  res.send(foundTicket);
});

export { router as showTicketRouter };
