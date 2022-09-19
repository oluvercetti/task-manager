// CRUD create read update delete

const { MongoClient, ObjectID } = require('mongodb'); 

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.error(error, 'connect failed');
    }

    const db = client.db(databaseName);
   /*  db.collection('tasks').insertMany([{
        description: 'This is a task',
        completed: true
    },
    {
        description: 'This was not completed',
        completed: false
    },
    {
        description: 'This was successfully completed',
        completed: true,
    }]) */

    db.collection('tasks').updateOne({
        _id: new ObjectID("631ea2f8cd567124d70116a0")
    }, { 
        $set: { 
            description : 'This task has been updated successfully',
        }
    }).then(result => {
        console.log("🚀 | file: mongodb.js | line 36 | MongoClient.connect | result", result);
    }).catch(error => {
        console.log("🚀 | file: mongodb.js | line 38 | MongoClient.connect | error", error);  
    })
})