import mongoose from "mongoose";    

const routinSchema = new mongoose.Schema ({
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