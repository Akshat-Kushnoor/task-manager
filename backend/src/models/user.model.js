import mongooose from "mongoose";

const refreshTokenSchema = new mongooose.Schema({
    token : {
        type:string,
        required:[true,"Token invalid try again:Refresh token not found"],
        default : null
    },
    replaceToken :{
        type:string,
        required:true,
        unique:true,
        default : null
    },
    revokedToken : {
        type : boolean,
        default : false
    }
}
,{timestamps:true});

export const refreshToken = mongooose.model("refreshToken",refreshTokenSchema);

const userSchema = new mongooose.Schema({
    username : {
        type:string,
        required:[true,"Please provide a name"],
        minlength : 3,
        maxlength : 20
    },
    email : {
        type:string,
        required:[true,"Please provide an email"],
        unique:true,
    },
    password : {
        type:string,
        required:[true,"Please provide a password"],
        minlength : 5,
        maxlength : 20
    },  
    goal : {
        type:string,
        required:[true,"Please provide a goal to arrange tasks"],
        unique:true
    },
    goalInfo : {
        type:mongoose.models.ObjectId,
        ref : "goalInfo",
        required:[true,"Please provide a goal to arrange tasks"]
    },

    dailyroutine : {
        type : mongoose.model.ObjectId,
        ref :"routine"
    },
    refreshToken : [refreshTokenSchema] // an array can make multiple device login
},
{timestamps:true});

export const user = mongooose.model("user",userSchema);

//* A simple data model for a Productivity web App
// follows this flow (expected for now)
// 1. User defines his goal
// 2. User gets detailed routine with tasks for the day
// 3. User completes the task and can see the progress
// 4. User creates a routine for the day

