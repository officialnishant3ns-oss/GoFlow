console.log("GoFlow...........")
import app from '../src/app.js'

import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})
import connectDatabase from './db/db.js'

connectDatabase()
    .then(() => {
      
        app.listen(process.env.PORT || 6001, () => {
            console.log(`server is ready at ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.error("Database connection failed", error)
    })

app.get('/api/v1', (req, res) => {
    res.send('Welcome to the Goflow App')
})

