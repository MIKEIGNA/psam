
const express = require('express');
const https = require('https');
const fs = require('fs');

const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  });
  
const app = express();
app.use(express.json());
app.use(limiter);
// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Rate Limiting


app.get('/', (req, res) => {
    console.log('Hello, World!');
    res.send('Hello, World!');
    
}); 



app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    console.log(`Login attempt for email: ${email}`);

    // Dummy email and password check (replace with actual database lookup)
    const storedEmail = 'test@example.com'; // Dummy email
    const storedHashedPassword = bcrypt.hashSync('test_password', 10); // Dummy hashed password

    if (email !== storedEmail) {
        return res.status(401).json({ error: 'Email not found.' }); // More specific error for email not found
    }

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error. Please try again.' });
        }

        if (!result) {
            // Return a more specific error message if the password is incorrect
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        // If email and password match
        res.json({ success: true, message: 'Login successful' });
    });
});



// app.post('/api/login', (req, res) => {
//     const { email, password } = req.body;

//     console.log(`Login attempt for email: ${email}`);

//     // Validate email and password input
//     if (!email || !password) {
//         return res.status(400).json({ error: 'Email and password are required' });
//     }

//     // Dummy hashed password (replace with real user lookup)
//     const hashedPassword = bcrypt.hashSync('test_password', 10);

//     // Compare the hashed password with the provided password
//     bcrypt.compare(password, hashedPassword, (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Server error' });
//         }

//         if (result) {
//             // On successful login
//             res.json({ success: true, message: 'Login successful' });
//         } else {
//             // On failure
//             res.status(401).json({ error: 'Invalid credentials' });
//         }
//     });
// });

// // User Login Route
// app.post('/api/login', (req, res) => {
//   const { email, password } = req.body;

//   console.log(`Login attempt for email: ${email}`); // Debugging log

//    // Dummy hashed password
//    const hashedPassword1 = bcrypt.hashSync('test_password', 10);

//   // Dummy check - replace with real database lookup
//   const hashedPassword = '$2a$10$J/xdvFLkZxAeGczlOdbpeOhW0fwv/Cu0cy/LKoDOvR1jY2Mkjqz4u'; // Pretend stored hash
//   bcrypt.compare(password, hashedPassword1, (err, result) => {
//     if (err) {
//       console.error(err); // Log the error for debugging
//       return res.status(500).json({ error: 'Server error' });
//     }

//     if (result) {
//       res.json({ success: true });
//     } else {
//       res.status(401).json({ error: 'Invalid credentials' });
//     }
//   });
// });

// Transaction Route
app.post('/api/transaction', (req, res) => {
  const { amount } = req.body;
  console.log(`Transaction attempt for amount: ${amount}`); // Debugging log

  // Input validation
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // Process transaction (Dummy response for now)
  res.json({ success: true, message: 'Transaction processed' });
});



// SSL setup for HTTPS
const sslOptions = {
    key: fs.readFileSync('./ssl/localhost-key.pem'),
    cert: fs.readFileSync('./ssl/localhost.pem')
};

// Start the server with HTTPS
https.createServer(sslOptions, app).listen(5000, () => {
    console.log('Server is running on https://localhost:5000');
});