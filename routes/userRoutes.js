import express from "express"

const router = express.Router()

import {
    loginUser,
    registerUser,
    userProfile,
    updateProfile,
    getUsers,
    updateUserProfilePicture
} from "../controllers/userControllers.js"

import { authGuard } from "../middleware/authMiddleware.js"

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile", authGuard, userProfile)
router.get("/", authGuard, getUsers)
router.put("/updateProfile", authGuard, updateProfile)
router.put("/updateUserProfilePicture/:userId", authGuard, updateUserProfilePicture)

export default router