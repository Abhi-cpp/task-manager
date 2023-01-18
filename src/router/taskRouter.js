const express = require('express')
const Task = require('../models/task')
const Router = new express.Router()
const auth = require('../middleware/auth')
Router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        const t = await task.save()
        res.status(201).send(t)
    } catch (e) {
        res.status(400).send(e)
    }
})
Router.get('/tasks', auth, async (req, res) => {
    try {
        const task = await Task.find({ owner: req.user._id })
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
Router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })
        if (!task)
            return res.status(404).send();
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

Router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description', 'completed']
    const isValidOpeartion = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOpeartion) return res.status(400).send({ error: "invalid update!" })
    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) return res.status(404).send()
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

Router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
        if (!task) return res.status(404).send()
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = Router