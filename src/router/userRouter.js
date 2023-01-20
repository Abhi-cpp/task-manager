const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendwelcomemail, senddeleteemail } = require('../emails/account')
//signup
router.post("/users", async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendwelcomemail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})
//login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})
//logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
//logout of all devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.send(500).send()
    }
})
//get all users
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// update data of a user by id
router.patch('/users/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password', 'age']
    const isValidOpeartion = updates.every((update) => allowedUpdate.includes(update)
    )
    if (!isValidOpeartion)
        return res.status(400).send({ error: "invalid updates!" })
    try {
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})
// delete user by id
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        senddeleteemail(req.user.email, req.user.name)
        res.status(200).send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        const extension = file.originalname
        if (!extension.match(/\.(png|jpeg|jpg)$/))
            cb(new Error('File is not in valid format'))
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async function (req, res) {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('done');
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
//deleting image avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send('avatar deleted')
    } catch (e) {
        res.status(500).send("error deleting")
    }
})
//getback image avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar)
            throw new Error()
        res.set('content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})
module.exports = router