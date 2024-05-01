import express from "express"

const router = express.Router()

import {
    loginUser,
    registerUser,
    userProfile,
    updateProfile,
    updateUserProfilePicture
} from "../controllers/userControllers.js"

import { authGuard } from "../middleware/authMiddleware.js"

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile", authGuard, userProfile)
router.put("/updateProfile", authGuard, updateProfile)
router.put("/updateProfilePicture", authGuard, updateUserProfilePicture)

export default router