import mongooose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

// user methods
userSchema.pre('save' , async function(next){
    if(!this.isModified('password')){
        next();
    }
    try {
        this.password = await bcrypt.hash(this.password,18);
    next();}
    catch(error){
        next(error); // Error Handleing Must revisit
    }

});

userSchema.methods.comparePassword = async function(password){
    try {
        return await bcrypt.compare(password,this.password);
    } catch (error) {
        next(error); // Error Handleing Must revisit
    }
};

userSchema.methods.refreshTokens = async function(token) {
    try {
        this.refreshToken.push({token});
        if(this.refreshTokens.length > 5) {
            this.refreshTokens = this.refreshTokens.slice(-5);

        }
    } 
    catch (error) {
        next(error); // Error Handleing Must revisit
    };
    return this.save();
};

userSchema.methods.deleteToken = async function(token) {
    try {
        this.refreshTokens = this.refreshTokens.filter((token) => token.token !== token);
    } 
    catch (error) {
        next(error); // Error Handleing Must revisit
    };
    return this.save();
};



export const user = mongooose.model("user",userSchema);

