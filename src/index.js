const express = require("express")
const messageRouter = require('./routers/messageRouter')
const { client } = require('./services/WhatsappClient')

client.initialize()

const app = express()
app.use(express.json())
app.use(messageRouter)

app.listen(process.env.PORT, () => console.log(`Server is ready in on port ${process.env.PORT}`))
