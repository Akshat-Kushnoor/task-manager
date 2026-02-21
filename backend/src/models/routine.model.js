import mongoose from "mongoose";    

const routinSchema = new mongoose.Schema ({
     user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
    taskList : [
       { type : mongoose.models.ObjectId,
        ref : "task",
        default : [],
        required : [true,"Please provide a list of tasks to design your routine for the day"]
      }
    ],

    isFollowed : {
        type : boolean,
        default : false
    }

},{timestamps:true});


export const routine = mongoose.model("routine",routinSchema);