
const taskRouter = require('./task')
const userRouter = require('./user')
const adminRouter = require('./admin')

const allRouters = [taskRouter, userRouter, adminRouter]

module.exports = allRouters