import mongoose from "mongoose";
import { PasswordManager } from "../services/password-manager";

/**
 * An interface that describes the properties
 * that are required to create a new user
 */
interface UserAttributes {
  email: string;
  password: string;
}

/**
 * An interface that describes the properties
 * that a user document has
 */
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

/**
 * An interface that describes the properties
 * that a user model has
 */
interface UserModel extends mongoose.Model<UserDocument> {
  build(attributes: UserAttributes): UserDocument;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.hash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
