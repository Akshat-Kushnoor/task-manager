import mongooose from "mongoose";

const userSchema = new mongooose.Schema({
    username : {
        type:string,
        required:[true,"Please provide a name"],
    },
    email : {
        type:string,
        required:[true,"Please provide an email"],
        unique:true,
    },
    password : {
        type:string,
        required:[true,"Please provide a password"],
    },  
    goal : {
        type:string,
        required:[true,"Please provide a goal to arrange tasks"],
    },
    goalInfo : {
        type:mongoose.models.ObjectId,
        ref : "goalInfo",
        required:[true,"Please provide a goal to arrange tasks"]
    },

    dailyroutine : {
        type : mongoose.model.ObjectId,
        ref :"routine"
    }
},
{timestamps:true});

export const user = mongooose.model("user",userSchema);

//* A simple data model for a Productivity web App
// follows this flow (expected for now)
// 1. User defines his goal
// 2. User gets detailed routine with tasks for the day
// 3. User completes the task and can see the progress
// 4. User creates a routine for the day

