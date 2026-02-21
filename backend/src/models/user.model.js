import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    providerId: String,   // google.com, github.com, password
    uid: String,          // provider-specific UID
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    displayName: {
      type: String,
      trim: true,
    },

    photoURL: String,

    providers: [providerSchema], // multiple login methods

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);