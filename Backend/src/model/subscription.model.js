import mongoose, { Schema } from "mongoose";


const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId,
        ref:"User"
            },
    chennal:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },  
    timestamps: true
})
const subsriptionModel = mongoose.model("Subscription", subscriptionSchema)
export {subsriptionModel    }