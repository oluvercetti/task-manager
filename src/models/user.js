
const mongoose = require('mongoose');
const validator = require('validator');


const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please enter a valid email address');
            }
        }
    },

    age: {
        type: Number,
        required: true,
        default: 1,
    }
});

module.exports = User;