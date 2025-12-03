import jwt from "jsonwebtoken";

const authenticateToken = (req,res,next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token) {
        return res.ApiError(401).json({message : "Acess token required"});
    }

    jwt.verify*token,process.env.ACCESS_TOKEN_SECRET,(err,user) => {
        if(err) {
            return res.ApiError(403).json({message : "Token seems to be expired or invalid"});
            // Error Handleing Must revisit
        }
        req.user = user;
        next();
    }
}

// JWT costom nessacary functions to declared :
const generateAccessToken = (user) => {
    return jwt.sign(
        {userId: user._id ,username : user.username}, process.env.ACCESS_TOKEN_SECRET , {expiresIn:"45m"}
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {userId: user._id ,username : user.username}, process.env.REFRESH_TOKEN_SECRET , {expiresIn:"10d"}
    );
};

export {authenticateToken,generateAccessToken,generateRefreshToken};