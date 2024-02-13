const express = require('express');
const User = require('./models/user');
const app = express();
const jwt = require('jsonwebtoken');
const Plans = require('./models/plans');
const Hospital = require('./models/hospital');
const nodemailer = require('nodemailer');
const PatientInsurance = require('./models/patientInsurance');
const connectDB = require('./config');
const port = 6001;
const cors = require('cors');
app.use(cors({ origin: '*' }));
app.use(express.json());
connectDB();
const gmailSender = async (to, subject, name, planName, planDate, hospital) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "noreplay.sss.groups@gmail.com",
            pass: "wlyr zsrr ufgm aahg",
        }
    });
    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Insurance Plan Availed Confirmation</title>
<style>
    /* Reset styles */
    body, html {
        margin: 0;
        padding: 0;
    }
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
    }
    .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    h1 {
        color: #333;
        text-align: center;
    }
    p {
        margin-bottom: 20px;
        color: #666;
    }
    .button {
        display: inline-block;
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
    }
    .button:hover {
        background-color: #0056b3;
    }
</style>
</head>
<body>
    <div class="container">
        <h1>Insurance Plan Availed Confirmation</h1>
        <p>Dear ${name},</p>
        <p>We are pleased to inform you that your request for availing the insurance plan at ${hospital} has been successfully processed.</p>
        <p>Your insurance plan details are as follows:</p>
        <ul>
            <li>Plan Name: ${planName}</li>
            <li>Effective Date: ${planDate}</li>
            <li>Policy Number: ${4554548}</li>
        </ul>
        <p>For any queries or assistance, please feel free to contact our customer support.</p>
        <p>Thank you for choosing ${hospital} for your healthcare needs.</p>
        <p>Sincerely,<br> Abdul Rehman<br> Developer</p>
        <ul>
            <li>Plan Name: ${planName}</li>
            <li>Effective Date: ${planDate}</li>
            <li>Policy Number: ${4554548}</li>
        </ul>
        <div style="text-align: center;">
            <a href="" class="button">Visit Our Website</a>
        </div>
    </div>
</body>
</html>

    
    `;
    const mailOptions = {
        from: "noreplay.sss.groups@gmail.com",
        to,
        subject,
        html
    };
    console.log("Email Status============>", mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("error============>", error);
        } else {
            console.log("success============>");
        }
    });
}
const ElasticEmail = require('@elasticemail/elasticemail-client');
var api = new ElasticEmail.CampaignsApi()
app.get('/', (req, res) => res.send('Insurance-Server-App-is-running!'));
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
        const patientDetails = await User.findById(patient);
        const planDetails = await Plans.findById(plan);
        const hospitalDetails = await Hospital.findById(hospital);
        const hospitalName = hospitalDetails?.name;
        const email = patientDetails?.email;
        const name = patientDetails?.name;
        const planName = planDetails?.name;
        const planDate = new Date();
        const subject = 'Insurance Plan Availed Confirmation';
        await gmailSender("abhai0548@gmail.com", subject, name, planName, planDate, hospitalName);
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
app.get('/api/insurance/dashboard', async (req, res) => {
    try {
        const hospitalCount = await Hospital.countDocuments({});
        const planCount = await Plans.countDocuments({});
        const userCount = await User.countDocuments({});
        const insuranceCount = await PatientInsurance.countDocuments({});
        return res?.json({ status: true, message: 'Insurance list', data: { hospitalCount:String(hospitalCount), planCount:String(planCount), userCount:String(userCount), insuranceCount:String(insuranceCount) } })
    } catch (error) {
        return res?.json({ status: false, message: error.message, data: null })
    }
});







app.listen(port, () => console.log(`Example app listening on port ${port}!`))