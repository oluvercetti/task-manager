const express = require('express') // use express to create server instance
require('./db/mongoose')
const allRouters = require('./routers')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(allRouters)


app.listen(port, () => {
    console.log('listening on port ' + port)
})