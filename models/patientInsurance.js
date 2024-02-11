const mongoose = require('mongoose');
const patientInsuranceSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plans',
    },  
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    signature:{
        type:String,
    }
},
    {
        timestamps: true,
    });
const PatientInsurance = mongoose.model('patientInsurance', patientInsuranceSchema);
module.exports = PatientInsurance;
