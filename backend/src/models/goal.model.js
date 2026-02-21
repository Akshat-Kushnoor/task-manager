import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
     user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
    goalname : {
        type:string,
        default : null,
        required:[true,"Please provide a goal name"],
        unique:true
     },
    goaldescription : {
        type:string,
        default : null,
        required:[true,"Please provide an description"]
    },
    goalDeadline : {
        type : Date,
        default : null,
        required: [true,"Please provide a deadline for decribed goal"]
    },
    goalPriority : {
        type : number,
        default : 1,
        required : [true,"Please provide a priority"]
    },
    goalType : {
        type : string,
        default : null,
        required : [true,"Please provide a type"]
    },
    goalStatus : {
        type : boolean,
        default : false
    
    }
})

export const goalInfo = mongoose.model("goalInfo",goalSchema);