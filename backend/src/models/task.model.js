import mongoose from "mongoose";    

const taskSchema = new mongoose.Schema({
    taskname : {
        type:string,
        required:[true,"Please provide a task name"],
        unique:true
     },
    taskdescription : {
        type:string,
        required:[true,"Please provide an description"]
    },
    taskstatus : {
        type : boolean,
        default : false
    },
    taskDeadline : {
        type : Date,
        default : Date.now,
        required: [true,"Please provide a deadline"]
    },
    taskTimeControl : {
        type : number,
        required : [true,"Please provide a time control"]
    },
    taskAssignedTo : {
        type : mongoose.model.ObjectId,
        ref :"user"
    },
    taskPriority : {
        type : number,
        required : [true,"Please provide a priority"]
    },
    
},{timestamps:true});

export const task = mongoose.model("task",taskSchema);