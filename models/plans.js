const mongoose = require('mongoose');
const plans = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['basic', 'premium', 'gold', 'platinum'],
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'hospital',
    },

},
    {
        timestamps: true,
    });
const Plans = mongoose.model('Plans', plans);
module.exports = Plans;
