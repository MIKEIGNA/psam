
// const express = require('express');
// const https = require('https');
// const fs = require('fs');
// const bcrypt = require('bcryptjs');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per windowMs
// });

// const app = express();
// app.use(express.json());
// app.use(limiter); // Rate Limiting

// // Middleware
// app.use(helmet());
// app.use(cors());
// app.use(express.json()); // Parse incoming JSON requests

// app.get('/', (req, res) => {
//     console.log('Hello, World!');
//     res.send('Hello, World!');
// });

// app.post('/api/login', (req, res) => {
//     const { email, password } = req.body;

//     console.log(`Login attempt for email: ${email}`);

//     // Dummy email and password check (replace with actual database lookup)
//     const storedEmail = 'test@example.com'; // Dummy email
//     const storedHashedPassword = bcrypt.hashSync('test_password', 10); // Dummy hashed password

//     if (email !== storedEmail) {
//         return res.status(401).json({ error: 'Email not found.' }); // More specific error for email not found
//     }

//     // Compare the provided password with the stored hashed password
//     bcrypt.compare(password, storedHashedPassword, (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Server error. Please try again.' });
//         }

//         if (!result) {
//             return res.status(401).json({ error: 'Incorrect password.' }); // More specific error for incorrect password
//         }

//         // If email and password match
//         res.json({ success: true, message: 'Login successful' });
//     });
// });

// // Transaction Route
// app.post('/api/transaction', (req, res) => {
//     const { amount, cardNumber, expiryDate, cvv } = req.body;

//     console.log(`Transaction attempt for amount: ${amount}, cardNumber: ${cardNumber}, expiryDate: ${expiryDate}`); // Debugging log

//     // Input validation
//     if (isNaN(amount) || amount <= 0) {
//         return res.status(400).json({ error: 'Invalid amount' });
//     }
    
//     // Validate credit card details
//     const cardNumberPattern = /^\d{16}$/; // Simple validation for 16-digit card number
//     const cvvPattern = /^\d{3,4}$/; // CVV can be 3 or 4 digits
//     const [month, year] = expiryDate.split('/').map((num) => parseInt(num));
//     const now = new Date();
//     const expiry = new Date(year + 2000, month - 1); // Adjust for 21st century

//     if (!cardNumberPattern.test(cardNumber)) {
//         return res.status(400).json({ error: 'Invalid card number. It must be 16 digits.' });
//     }

//     if (!expiryDate || expiry < now) {
//         return res.status(400).json({ error: 'Invalid expiry date. It must be in the future.' });
//     }

//     if (!cvvPattern.test(cvv)) {
//         return res.status(400).json({ error: 'CVV must be 3 or 4 digits.' });
//     }

//     // Process transaction (Dummy response for now)
//     res.json({ success: true, message: 'Transaction processed successfully' });
// });

// // SSL setup for HTTPS
// const sslOptions = {
//     key: fs.readFileSync('./ssl/localhost-key.pem'),
//     cert: fs.readFileSync('./ssl/localhost.pem')
// };

// // Start the server with HTTPS
// https.createServer(sslOptions, app).listen(5000, () => {
//     console.log('Server is running on https://localhost:5000');
// });




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
app.use(cookieParser()); // Use cookie parser

// Dummy in-memory user storage (replace with a database in production)
const users = {};

// Helper function to validate password
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

// Helper function for input validation
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

// // User registration route (for completeness)
// app.post('/api/register', async (req, res) => {
//     const { email, password } = req.body;
    
//     // Validate input
//     const errors = validateInput(email, password);
//     if (Object.keys(errors).length) {
//         return res.status(400).json({ errors });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     // Store user (replace with database storage)
//     users[email] = { password: hashedPassword };

//     res.json({ success: true, message: 'User registered successfully' });
// });

// app.post('/api/register', async (req, res) => {
//     const { email, password } = req.body;

//     console.log('Registration attempt:', { email, password }); // Log incoming data

//     // Validate input
//     const errors = validateInput(email, password);
//     if (Object.keys(errors).length) {
//         console.log('Validation errors:', errors); // Log errors
//         return res.status(400).json({ errors });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Check if user already exists
//     if (users[email]) {
//         return res.status(400).json({ error: 'User already exists.' });
//     }

//     // Store user
//     users[email] = { password: hashedPassword };
//     console.log('User registered:', email); // Log successful registration

//     res.json({ success: true, message: 'User registered successfully' });
// });


app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    console.log('Registration attempt:', { email, password });

    // Validate input
    const errors = validateInput(email, password);
    if (Object.keys(errors).length) {
        console.log('Validation errors:', errors);
        return res.status(400).json({ errors });
    }

    // Check if user already exists
    if (users[email]) {
        return res.status(400).json({ error: 'User already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Store user
    users[email] = { password: hashedPassword };
    console.log('User registered:', email);

    // Respond with a success message
    return res.json({ success: true, message: 'User registered successfully' });
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    console.log(`Login attempt for email: ${email}`);

    // Check if user exists
    const user = users[email];
    if (!user) {
        return res.status(401).json({ error: 'Email not found.' });
    }

    // Compare the provided password with the stored hashed password
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
        return res.status(401).json({ error: 'Incorrect password.' });
    }

    // Set secure cookie (httpOnly) for session management
    res.cookie('session', 'your_session_token', { httpOnly: true, secure: true });

    res.json({ success: true, message: 'Login successful' });
});

// Transaction Route
app.post('/api/transaction', (req, res) => {
    const { amount } = req.body;
    console.log(`Transaction attempt for amount: ${amount}`);

    // Input validation for amount
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    // Process transaction (Dummy response for now)
    res.json({ success: true, message: 'Transaction processed' });
});

// SSL setup for HTTPS
const sslOptions = {
    key: fs.readFileSync('./ssl/localhost-key.pem'),
    cert: fs.readFileSync('./ssl/localhost.pem'),
};

// Start the server with HTTPS
https.createServer(sslOptions, app).listen(5000, () => {
    console.log('Server is running on https://localhost:5000');
});
