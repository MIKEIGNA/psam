const express = require('express');
const https = require('https');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); // For cookie handling
const validator = require('validator');


dotenv.config();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});

const app = express();
app.use(bodyParser.json());
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(cookieParser());

// Dummy in-memory user storage (replace with a database in production)
const users = {};


const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;


const validateInput = (email, password) => {
    let errors = {};
    if (!validator.isEmail(email)) {
        errors.email = 'A valid email address is required.';
    }
    if (!passwordRegex.test(password)) {
        errors.password = 'Password must be at least 8 characters long, and include at least one letter and one number.';
    }
    return errors;
};

app.get('/', (req, res) => {
    console.log('Hello, World!');
    res.send('Hello, World!');
});

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    console.log('Registration attempt:', { email, password });

    const errors = validateInput(email, password);
    if (Object.keys(errors).length) {
        console.log('Validation errors:', errors);
        return res.status(400).json({ errors });
    }

    if (users[email]) {
        return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    users[email] = { password: hashedPassword };
    console.log('User registered:', email);

    return res.json({ success: true, message: 'User registered successfully' });
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    console.log(`Login attempt for email: ${email}`);

    const user = users[email];
    if (!user) {
        return res.status(401).json({ error: 'Email not found.' });
    }

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
        return res.status(401).json({ error: 'Incorrect password.' });
    }

    res.cookie('session', 'your_session_token', { httpOnly: true, secure: true });

    res.json({ success: true, message: 'Login successful' });
});

app.post('/api/transaction', (req, res) => {
    const { amount } = req.body;
    console.log(`Transaction attempt for amount: ${amount}`);

    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    res.json({ success: true, message: 'Transaction processed' });
});

const sslOptions = {
    key: fs.readFileSync('./ssl/localhost-key.pem'),
    cert: fs.readFileSync('./ssl/localhost.pem'),
};

https.createServer(sslOptions, app).listen(5000, () => {
    console.log('Server is running on https://localhost:5000');
});
