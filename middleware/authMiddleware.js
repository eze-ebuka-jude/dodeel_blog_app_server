import ver from "jsonwebtoken"
import User from "../models/User.js"

const { verify } = ver

const authGuard = async(req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        console.log(req.headers.authorization)
        try {
            const token = req.headers.authorization.split(" ")[1];
            const { id } = verify(token, process.env.JWT_TOKEN)
            req.user = await User.findById(id).select("-password")
            next()
        } catch (error) {
            let err = new Error("Not authorized, Token failed")
            err.statusCode = 401
            next(err)
        }    
    }else {
        let error = new Error("Not authorized, no token")
        err.statusCode = 401
        next(error)  
    }
}

export { authGuard }