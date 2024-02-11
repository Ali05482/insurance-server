const mongoose = require('mongoose');
const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
        required:true,
    }
},
{
    timestamps:true,
} 
);
const Hospital = mongoose.model('hospital', hospitalSchema);    
module.exports = Hospital;