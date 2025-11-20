console.log("GoFlow...........")

import express from 'express'
import dotenv from "dotenv"
 dotenv.config({
    path: './.env'
})
const app = express()

const port = process.env.port || 6001


app.get('/api/v1', (_, res) => {
    res.send('Welcome to the Goflow App')
})

app.listen(process.env.PORT || 8000, () => {
    console.log(`server is ready at ${process.env.PORT}`);
})