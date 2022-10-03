const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')



//TASK API
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(200).send({task, message: 'Task saved successfully' })
    } catch (e) {
        res.status(400).send(e)
        
    }
})

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const limit = parseInt(req.query.limit) || 3
    const page = req.query.page > 1 ? (parseInt(req.query.page) - 1) * limit : 0 //this is my implementation
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // const tasks = await Task.find({owner: req.user._id}) // this is one way to do it

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit,
                skip: page,
                sort
            }
        }) // this is the other way to get it done execPopulate has been removed from the docs
        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send(err)   
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send({ message: 'Task not found' })
        }
        res.send(task)
    } catch (err) {
        res.status(500).send()    
    }
})

router.patch('/tasks/:id', auth, async (req, res) => { 
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid operation' })
    }
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task) {
            return res.status(404).send({ error: 'Task not found' })
        }

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        res.send(task)
    } catch (err) {
        res.status(400).send({ error: 'Error occurred'})
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send({ error: 'Task not found' })
        }

        res.send({message: 'Deleted Successfully'})

    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router