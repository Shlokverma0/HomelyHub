import bcrypt from "bcrypt";
import crypto from "node:crypto";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxlength: [50, "Your name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator(value) {
          return value === this.password;
        },
        message: "Passwords do not match",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your phone number"],
      unique: true,
      trim: true,
      match: [/^[+\d][\d\s()-]{7,19}$/, "Please enter a valid phone number"],
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    passwordChangedAt: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform(_doc, result) {
    delete result.password;
    delete result.passwordConfirm;
    delete result.passwordResetToken;
    delete result.passwordResetExpires;
    delete result.passwordChangedAt;
    delete result.__v;
    return result;
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = function (candidate, storedHash) {
  return bcrypt.compare(candidate, storedHash);
};

userSchema.methods.changedPasswordAfter = function (issuedAt) {
  if (!this.passwordChangedAt) return false;
  const changedAtSeconds = Math.floor(this.passwordChangedAt.getTime() / 1000);
  return issuedAt < changedAtSeconds;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export { User };
