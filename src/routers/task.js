const express = require('express')
const router = express.Router()
const Task = require('../models/task')



//TASK API
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(200).send({ message: 'Task saved successfully' })
    } catch (e) {
        res.status(400).send(e)
        
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (err) {
        res.status(500).send()   
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send({ message: 'Task not found' })
        }
        res.send(task)
    } catch (err) {
        res.status(500).send()    
    }
})

router.patch('/tasks/:id', async (req, res) => { 
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid operation' })
    }
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (err) {
        res.status(400).send({ error: 'Error occured'})
    }
})

router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(_id)
        if (!task) {
            return res.status(404).send()
        }

        res.send({message: 'Deleted Successfully'})

    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router