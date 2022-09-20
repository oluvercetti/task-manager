const express = require('express'); // use express to create server instance
require('./db/mongoose')
const taskRouter = require('./routers/task');
const userRouter = require('./routers/user')

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use([userRouter, taskRouter]);


app.listen(port, () => {
    console.log('listening on port ' + port);
})