import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
);
userSchema.pre(save(), async function(next) {
    await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isCorrectPassword = function() {
    bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    jwt.sign({
        _id:this._id,
        email: this.email,
        username: this.userSchema
    }, ACCESS_TOKEN_SECRET)
        
}

userSchema.methods.refrashAccessToken = function() {
    jwt.sign({
        _id:this._id,
        email: this.email,
        username: this.userSchema
    }, RERESH_TOKEN_SECRET)
        
}

export const User = mongoose.model("User", userSchema);
