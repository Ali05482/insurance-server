const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['patient', 'admin'],
    },
    password: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hospital',
    },  
},
    {
        timestamps: true,
    });
const User = mongoose.model('user', userSchema);
module.exports = User;