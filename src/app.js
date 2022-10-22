const express = require('express') // use express to create server instance
require('./db/mongoose')
const allRouters = require('./routers')

const app = express()

app.use(express.json())
app.use(allRouters)

module.exports = app
