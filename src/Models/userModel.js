//user Schema

import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import crypto from "node:crypto"

const userSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: [true, "Please enter your name"],
      //'   arpit       '
      trim: true,
      maxLength:[50, "Your name cannot be more than 50 chars"]
    },
    email:{
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      lowercase: true,
      unique: true,
      validator: [validator.isEmail, "Please enter your email ID"]
    },
    password: {
      type: String,
      required:  [true, "Please enter your password"],
      minLength: [6, "Your password should be at Least 6 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function(el){
          return el === this.password;
        }, message: "Password does not match!"
      }
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true

    },
    role:{
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    avatar:{
      url:{ type: String },
      public_id:{type: String}
    },
    passwordChangedAt:{
     type: Date,
     passwordResetToken: String,
     select: false,
     index: true 
    },
    passwordResetExpires:{
      type: Date,
      select: false
    }
  },
  {timestamps: true}
)
//settings to not pass in response from server 
userSchema.set("toJSON", {
  transform: function(doc,ret){
    delete ret.password;
    delete ret.passwordConfirm;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.__v;
    return ret;
  }
})

//password logic
//hashing the password for security

userSchema.pre("save", async function(){
  if(!this.isModified("password")) return ;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
})

//login check
// test123 = wioe23ihddnbouqe23h8y57
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
  return await bcrypt.compare(candidatePassword, userPassword);
}

//
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
    return JWTTimestamp < changedTimestamp;;

  }
  return false;
}

//forgot password
userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").
  update(resetToken)
  .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
}

const User = mongoose.model("User", userSchema);
//in mongodb : users
export {User};