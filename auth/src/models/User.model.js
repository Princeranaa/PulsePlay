import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    fullname: {
      firstname: {
        type: String,
        require: true,
      },
      lastname: {
        type: String,
        require: true,
      },
    },
    password: {
      type: String,
      required: function () { return !this.googleId } 
    },
    googleId: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);


module.export = mongoose.model("user", userSchema);