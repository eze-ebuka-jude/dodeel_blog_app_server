import express from 'express'

const app = express()

app.get("/", (req, res) => {
    res.send("Server is Running...")
})

const port = 4040

app.listen(port, () => { console.log(`Server listening at port - ${port}`) })