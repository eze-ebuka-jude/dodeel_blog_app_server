import express from "express"

const router = express.Router()
import { createPost, deletePost, getPost, updatePost, getAllPost } from "../controllers/postControllers.js"
import { authGuard, adminGuard } from "../middleware/authMiddleware.js"

router.route("/").post( authGuard, adminGuard, createPost).get(getAllPost)
router
    .route("/:slug")
    .put(authGuard, adminGuard, updatePost)
    .delete(authGuard, adminGuard, deletePost)
    .get(getPost)

export default router