import { uploadPicture } from "../middleware/uploadPicture.js";
import User from "../models/User.js"
import { fileRemover } from "../utils/fileRemover.js" 

export const registerUser = async(req, res, next) => {
    try {
        const { name, email, password } = req.body;

        //check if user exists
        let user = await User.findOne({ email });
        if(user) {
            throw new Error(`User with email ${email} already exist`)
        }

        //create new user
        user = await User.create({
            name,
            email,
            password
        });

        return res.status(201).json({
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            password: user.password,
            verified: user.verified,
            admin: user.admin,
            token: await user.generateJWT()
        })
    } catch (error) {
        next(error)
    }
}

export const loginUser = async function(req, res, next) {
    try {
        const { email, password } = req.body

        let user = await User.findOne({ email })
        console.log(email, password)
        if(!user) throw new Error(`The Email ${email} was not found, try again..`)

        const isMatch = await user.comparePassword(password)
        
        if(!isMatch) {
            return res.status(201).json({
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
                email: user.email,
                password: user.password,
                verified: user.verified,
                token: await user.generateJWT()
            })
        }else {
            throw new Error("Invalid email or password")
        }
    }catch(error) {
        next(error)
    }
}

export const userProfile = async(req, res, next) => {
    try {
        let user = await User.findById(req.user._id);

        if(user) {
            return res.status(201).json({
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
                email: user.email,
                password: user.password,
                verified: user.verified
            })
        }else {
            let error = new Error("User not found");
            error.statusCode = 404
            next(error)
        }
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async(req, res, next) => {
    try {
        let user = await User.findById(req.user._id)

        if(!user) throw new Error("User not found")

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if(req.body.password && req.body.password < 6) {
            throw new Error("Password length must be 6 characters long")
        }else if(req.body.password) {
            user.password = req.body.password
        }

        const updatedUserProfile = await user.save()

        res.json({
            _id: updatedUserProfile._id,
            avatar: updatedUserProfile.avatar,
            name: updatedUserProfile.name,
            email: updatedUserProfile.email,
            password: updatedUserProfile.password,
            verified: updatedUserProfile.verified,
            token: await updatedUserProfile.generateJWT()
        })
    } catch (error) {
        next(error)
    }
}

export const updateUserProfilePicture = async(req, res, next) => {
    try {
        const upload = uploadPicture.single("profilePicture")
        
        upload(req, res, async function(err) {
            if(err) {
                const error = new Error("An unknown error ocurred when uploading " + err.message)
                next(error)
            }else {
                if(req.file) {
                    let filename;
                    const updatedUser = await User.findById(req.user._id)
                    filename = updatedUser.avatar
                    if(filename) fileRemover(filename)
                    updatedUser.avatar = req.file.filename
                    await updatedUser.save()

                    res.json({
                        _id: updatedUser._id,
                        avatar: updatedUser.avatar,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        password: updatedUser.password,
                        verified: updatedUser.verified,
                        token: await updatedUser.generateJWT()
                    });
                }else {
                    let filename;
                    let updatedUser = await User.findById(req.user._id);
                    filename = updatedUser.avatar;
                    updatedUser.avatar = "";
                    await updatedUser.save();
                    fileRemover(filename);
                    res.json({
                        _id: updatedUser._id,
                        avatar: updatedUser.avatar,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        password: updatedUser.password,
                        verified: updatedUser.verified,
                        token: await updatedUser.generateJWT()
                    });
                }
            }
        })
    } catch (error) {
        next(error)
    }
}