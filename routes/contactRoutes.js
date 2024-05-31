import express from "express"

const router = express.Router()

import { sendMessage, getAllMessages } from "../controllers/contactControllers.js"

router.route("/").post(sendMessage).get(getAllMessages)

export default router