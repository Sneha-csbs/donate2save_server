import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["donor", "requester", "admin"],
      required: true,
    },
    // Donor specific fields
    bloodGroup: {
      type: String,
      enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
      required: function() { return this.role === "donor"; }
    },
    city: {
      type: String,
      required: function() { return this.role === "donor"; }
    },
    phone: {
      type: String,
      required: function() { return this.role === "donor"; }
    },
    // Requester specific fields
    orgName: {
      type: String,
      required: function() { return this.role === "requester"; }
    },
    contact: {
      type: String,
      required: function() { return this.role === "requester"; }
    }
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);