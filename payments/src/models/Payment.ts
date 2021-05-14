import mongoose from "mongoose";

/**
 * An interface that describes the properties
 * that are required to create a new user
 */
interface PaymentAttributes {
  orderId: string;
  stripeId: string;
}

/**
 * An interface that describes the properties
 * that a user document has
 */
interface PaymentDocument extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

/**
 * An interface that describes the properties
 * that a user model has
 */
interface PaymentModal extends mongoose.Model<PaymentDocument> {
  build(attributes: PaymentAttributes): PaymentDocument;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.statics.build = (attributes: PaymentAttributes) => {
  return new Payment(attributes);
};

const Payment = mongoose.model<PaymentDocument, PaymentModal>(
  "Payment",
  paymentSchema
);

export { Payment };
