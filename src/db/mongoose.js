const mongoose = require('mongoose');
const validator = require('validator');

const taskManagerConnectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';

mongoose.connect(taskManagerConnectionURL, {
    useNewUrlParser: true,
})

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
    }
});

const me = new User({
    name: 'Ayodeji',
    age: '23',
});

me.save().then(() => {
    console.log('User saved successfully', me);
}).catch(err => {
    console.error('Error',err);
});