const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp');
const { sendWelcomeMessage, sendCancellationMessage } = require('../emails/account')



//POST /users

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        //sendWelcomeMessage(user.email, user.name) //this was commented because email has not been configured yet
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    } catch (e) {
        res.status(400).send(e.message || 'Error occurred')
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e.message || 'Error occurred')
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(400).send(e.message || 'Error occurred')
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e.message || 'Error occurred')
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if( !file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)) {
            return cb(new Error('Please upload a valid image'))
        }

        cb(null, true)
    }
})

router.post('/users/me/avatar',auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save();
    res.send('Uploaded successfully')
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})

//GET /users/
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users/me/avatar', auth, async (req, res) => {
    try {
        if(!req.user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(req.user.avatar)
    } catch (e) {
        res.status(404).send({ error: 'Avatar not found' })
    }
})


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid operation' })
    }
    
    try {

        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(400).send({ error: 'Error occurred' })
    }
})

router.delete('/users/me', auth, async (req, res) => {
    const email = req.user.email;
    const name = req.user.name;
    try {
        await req.user.remove()
        //sendCancellationMessage(email, name)
        res.send({ message: 'Deleted Successfully' })

    } catch (e) {
        res.status(500).send()
    }
})


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    try {
        await req.user.save()
        res.send({ message: 'Deleted Successfully' })
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router 