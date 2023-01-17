const express = require('express')
const Task = require('../models/task')
const Router = new express.Router()

Router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        const t = await task.save()
        res.status(201).send(t)
    } catch (e) {
        res.status(400).send(e)
    }
})
Router.get('/tasks', async (req, res) => {
    try {
        const task = await Task.find({})
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})
Router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById({ _id })
        if (!task)
            return res.status(404).send();
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

Router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description', 'completed']
    const isValidOpeartion = updates.every((update) => allowedUpdate.includes(update))
    if (!isValidOpeartion) return res.status(400).send({ error: "invalid update!" })
    try {
        const task = await Task.findById(_id)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        if (!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

Router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(_id);
        if (!task) return res.status(404).send()
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = Router