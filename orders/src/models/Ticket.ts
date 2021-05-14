import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./Order";

/**
 * An interface that describes the properties
 * that are required to create a new record
 */
interface TicketAttributes {
  id: string;
  title: string;
  price: number;
}

/**
 * An interface that describes the properties
 * that a document has
 */
export interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

/**
 * An interface that describes the properties
 * that the model has
 */
interface TickedModel extends mongoose.Model<TicketDocument> {
  build(attributes: TicketAttributes): TicketDocument;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDocument | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, returnValue) {
        returnValue.id = returnValue._id;
        delete returnValue._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attributes: TicketAttributes) => {
  return new Ticket({
    _id: attributes.id,
    title: attributes.title,
    price: attributes.price,
  });
};

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  const { id, version } = event;

  return Ticket.findOne({
    _id: id,
    version: version - 1,
  });
};

ticketSchema.methods.isReserved = async function () {
  /**
   * this === the ticket document that we just called 'isReserved' on
   */
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDocument, TickedModel>(
  "Ticket",
  ticketSchema
);

export { Ticket };
