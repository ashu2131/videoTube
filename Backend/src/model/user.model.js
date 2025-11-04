import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  userName: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  profilePic: {
    type: String,
    require: true,
  },
  coverImage: {
    type: String,
  },
    AccessToken:{
    type: String
    
  },
  refrashToken:{
    type: String

  }
});

// userSchema.pre("save", async function (next) {
//     if(!this.isModified("password")) return next();

//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // important!
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};



userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const userModel = mongoose.model("User", userSchema);
export { userModel };

