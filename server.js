import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import connectDB from './config/db.js'
import { errorResponseHandler, invalidPathHandler } from './middleware/errorHandler.js'

import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import contactRoutes from "./routes/contactRoutes.js"

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename)

dotenv.config()

connectDB()

const app = express()
app.use(express.json({ limit: '150mb' }));

app.use(express.urlencoded({ limit: '150mb', extended: true }));

app.use(cors({
    origin: 'https://dodeel-blog-app-client.onrender.com'
}))

app.get("/", (req, res) => {
    res.send("Server is Running...")
})

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/contacts", contactRoutes)

app.use(express.static(path.join(__dirname, 'build')))

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "build", "index.html"))
// })

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// app.use(invalidPathHandler);
// app.use(errorResponseHandler)

const port = 5000 || process.env.PORT

app.listen(port, () => { console.log(`Server listening at port - ${port}`) })