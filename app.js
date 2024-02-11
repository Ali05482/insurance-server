const express = require('express');
const User = require('./models/user');
const app = express();
const jwt = require('jsonwebtoken');
const Plans = require('./models/plans');
const Hospital = require('./models/hospital');
const PatientInsurance = require('./models/patientInsurance');
const connectDB = require('./config');
const port = 6001;
const cors = require('cors');
app.use(cors({ origin: '*' }));
app.use(express.json());
connectDB();
const ElasticEmail = require('@elasticemail/elasticemail-client');
var api = new ElasticEmail.CampaignsApi()
app.post('/api/register', async (req, res) => {
    console.log(req?.body)
    try {
        const { name, email, password, role, hospital } = req?.body;
        const user = await User.findOne({
            email,
        });
        if (user) {
            return res?.json({ status: false, message: 'User already exists', data: null })
        }
        const newUser = await User.create({
            name,
            email,
            password,
            role,
            hospital,
        });
        return res?.json({ status: true, message: 'User created successfully', data: newUser })
    } catch (error) {
        console.log(error?.message)
        return res?.json({ status: false, message: error.message, data: null })
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req?.body;
        const user = await User.findOne({
            email
        });
        if (!user) {
            return res?.json({ status: false, message: 'Invalid credentials', data: null })
        }
        if (user?.password !== password) {
            return res?.json({ status: false, message: 'Invalid credentials', data: null })
        }
        const data = {
            id: user?._id,
            name: user?.name,
            email: user?.email,
            role: user?.role,
            hospital: user?.hospital,
        }
        const token = jwt?.sign(data, '12345', { expiresIn: '1h' })
        return res?.json({ status: true, message: 'User logged in successfully', data: token })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});
app.get('/api/user/list', async (req, res) => {
    try {
        const users = await User.find({});
        return res?.json({ status: true, message: 'User list', data: users })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});
app.delete('/api/user/delete/:id', async (req, res) => {
    try {
        const users = await User.findByIdAndDelete(req?.params?.id);
        return res?.json({ status: true, message: 'User deleted successfully', data: users })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});
app.put('/api/user/update', async (req, res) => {
    try {
        const { name, email, password, role, hospital, _id } = req?.body;
        const updateUser = await User.findByIdAndUpdate(_id, {
            name,
            email,
            password,
            role,
            hospital,
        });
        return res?.json({ status: true, message: 'User updated successfully', data: updateUser })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/signature')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file?.originalname))
    }
});
const upload = multer({ storage: storage });
app.post('/api/user/signature/add', upload.single('signature'), async (req, res) => {
    try {
        const { userId } = req?.body;
        const newSignature = await User.create({
            signature: req?.file?.path
        });
        return res?.json({ status: true, message: 'Signature created successfully', data: newSignature })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});



// Plans
app.post('/api/plans/add', async (req, res) => {
    try {
        const { name, description, duration, price, type } = req?.body;
        const newPlan = await Plans.create({
            name,
            price,
            duration,
            description,
            type

        });
        return res?.json({ status: true, message: 'Plan created successfully', data: newPlan })

    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});
app.put('/api/plans/update', async (req, res) => {
    try {
        const { name, description, duration, price, type, _id } = req?.body;
        const newPlan = await Plans.findByIdAndUpdate(_id, {
            name,
            price,
            duration,
            description,
            type
        });
        return res?.json({ status: true, message: 'Plan updated successfully', data: newPlan })

    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});
app.get('/api/plans/list', async (req, res) => {
    try {
        const plans = await Plans.find({});
        return res?.json({ status: true, message: 'Plan list', data: plans })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});
app.delete('/api/plans/delete/:id', async (req, res) => {
    try {
        const plans = await Plans.findByIdAndDelete(req?.params?.id);
        return res?.json({ status: true, message: 'Plan deleted successfully', data: plans })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});

// Hospital
app.post('/api/hospital/add', async (req, res) => {
    try {
        const { name, address, contact } = req?.body;
        const newHospital = await Hospital.create({
            name,
            address,
            contact,
        });
        return res?.json({ status: true, message: 'Hospital created successfully', data: newHospital })

    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});
app.put('/api/hospital/update', async (req, res) => {
    try {
        const { name, address, contact, _id } = req?.body;
        const newHospital = await Hospital.findByIdAndUpdate(_id, {
            name,
            address,
            contact,
        });
        return res?.json({ status: true, message: 'Hospital updated successfully', data: newHospital })

    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});
app.get('/api/hospital/list', async (req, res) => {
    try {
        const hospital = await Hospital.find({});
        return res?.json({ status: true, message: 'Hospital list', data: hospital })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});
app.delete('/api/hospital/delete/:id', async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req?.params?.id);
        return res?.json({ status: true, message: 'Hospital deleted successfully', data: hospital })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});

// User Insurance info
app.post('/api/insurance/add', async (req, res) => {
    try {
        const { patient, plan, hospital, amount, signature } = req?.body;
        const newInsurance = await PatientInsurance.create({
            patient,
            plan,
            hospital,
            amount,
            signature
        });
        const defaultEmail = ElasticEmail.ApiClient.instance;
        const apiKey = defaultEmail?.authentications['apikey'];
        apiKey.apiKey = "317BCF3586485F522274D0D444E2441B5E4CB00A0B683C8B744415E20F84FF075FB2032384583FF7CBFC061E3BD45864";
        const api = new ElasticEmail.CampaignsApi();
        return res?.json({ status: true, message: 'Insurance created successfully', data: newInsurance })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});
app.put('/api/insurance/update', async (req, res) => {
    try {
        const { patient, plan, hospital, amount, _id } = req?.body;
        const newInsurance = await PatientInsurance.findByIdAndUpdate(_id, {
            patient,
            plan,
            hospital,
            amount,
        });
        return res?.json({ status: true, message: 'Insurance updated successfully', data: newInsurance })

    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});
app.get('/api/insurance/list', async (req, res) => {
    try {
        const insurance = await PatientInsurance.find({}).populate('patient').populate('plan');
        return res?.json({ status: true, message: 'Insurance list', data: insurance })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});







app.listen(port, () => console.log(`Example app listening on port ${port}!`));