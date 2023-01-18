const mongoose = require('mongoose')
const taskschema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    }
}, {
    timestamps: true
})
const task = mongoose.model('Task', taskschema)

module.exports = task