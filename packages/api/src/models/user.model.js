const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true, default: 'user'},
    bio: {type: String, required: false}
})

module.exports = mongoose.model('user', userModel)

