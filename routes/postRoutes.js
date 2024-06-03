import express from "express"

const router = express.Router()
import { createPost, deletePost, getPost, updatePost, getAllPost, likePosts } from "../controllers/postControllers.js"
import { authGuard, adminGuard } from "../middleware/authMiddleware.js"

router.route("/").post(authGuard, createPost).get(getAllPost)
router.route("/:slug").put(authGuard, updatePost).delete(authGuard, deletePost).get(getPost)
router.post("/:slug/like", likePosts)
// router.get("/ranked", rankedPosts)

export default router