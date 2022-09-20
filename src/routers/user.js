const express = require('express');
const User = require('../models/user');
const router = new express.Router();


//USERS API
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save();
        res.status(200).send({ message: 'User saved successfully' });
    } catch (e) {
        res.status(400).send(e.message || 'Error occured')
    }
})

router.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send();
        }

        res.send(user)

    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/:id', async (req, res) => { 
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid operation' });
    }
    const _id = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (err) {
        res.status(400).send({ error: 'Error occured'})
    }
})

router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            return res.status(404).send();
        }

        res.send({message: 'Deleted Successfully'});

    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router ;