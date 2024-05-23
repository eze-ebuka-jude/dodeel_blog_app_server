import ver from "jsonwebtoken"
import User from "../models/User.js"

const { verify } = ver

const authGuard = async(err, req, res, next) => {
    console.log(req.headers.authorization)
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        console.log(req.headers.authorization)
        try {
            const token = req.headers.authorization.split(" ")[1];
            const { id } = verify(token, process.env.JWT_TOKEN)
            req.user = await User.findById(id).select("-password")
            if(!token) return res.status(401).json({ msg: 'No token, not authorized' })
            next()
        } catch (err) {
            // let err = new Error("Not authorized, Token failed")
            err.statusCode = 401
            next(err)
        }    
    }else {
        let error = new Error("Not authorized, no token")
        err.statusCode = 401
        next(error)  
    }
}

const adminGuard = async(req, res, next) => {
    if(req.user && req.user.admin) {
        next()
    }else {
        let error = new Error("Not authorized as an admin")
        error.statusCode = 401
        next(error)
    }
}

export { authGuard, adminGuard }