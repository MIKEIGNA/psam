// const express = require('express');
// const bcrypt = require('bcryptjs');
// const helmet = require('helmet');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const rateLimit = require('express-rate-limit');
// const https = require('https-localhost')();
// const path = require('path');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(helmet()); // Protects against well-known web vulnerabilities
// app.use(cors()); // Allow CORS
// app.use(express.json()); // Parse incoming JSON requests

// // Rate Limiting to protect against brute-force attacks
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per window
// });
// app.use(limiter);

// // Dummy users (replace this with database later)
// const users = [
//   {
//     email: 'test@example.com',
//     password: '$2a$10$FhV5m3UyRm6pHKcXQeOD/udMYR6aihuqM4WdbWg2FIoAE8UJe9T.e', // hashed password for "test_password"
//   },
// ];

// // RegEx for input validation
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// // Routes
// app.post('/api/login', (req, res) => {
//   const { email, password } = req.body;

//   // Validate input
//   if (!emailRegex.test(email)) {
//     return res.status(400).json({ error: 'Invalid email format' });
//   }

//   // Find user (replace with database lookup later)
//   const user = users.find((u) => u.email === email);

//   if (!user) {
//     return res.status(401).json({ error: 'Invalid credentials' });
//   }

//   // Compare password
//   bcrypt.compare(password, user.password, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: 'Server error' });
//     }
//     if (!result) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
//     res.json({ success: true });
//   });
// });

// app.post('/api/transaction', (req, res) => {
//   const { amount } = req.body;

//   // Validate amount (it must be a number greater than 0)
//   if (isNaN(amount) || amount <= 0) {
//     return res.status(400).json({ error: 'Invalid amount' });
//   }

//   // Process payment (dummy logic for now)
//   res.json({ success: true, message: 'Transaction processed' });
// });

// // Serve the frontend
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// // Serve SSL
// https.listen(5000, () => {
//   console.log(`Secure server running on https://localhost:5000`);
// });



// const express = require('express');
// const bcrypt = require('bcryptjs');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const https = require('https-localhost')();

// dotenv.config();

// const app = express();
// app.use(helmet());
// app.use(cors());
// app.use(express.json());

// // Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
// });
// app.use(limiter);

// // Dummy hashed password
// const hashedPassword = bcrypt.hashSync('test_password', 10);

// // User Login Route
// app.post('/api/login', (req, res) => {
//   const { email, password } = req.body;

//   // Dummy check - replace with real database lookup
//   if (email === 'test@example.com') {
//     bcrypt.compare(password, hashedPassword, (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: 'Server error' });
//       }

//       if (result) {
//         res.json({ success: true });
//       } else {
//         res.status(401).json({ error: 'Invalid credentials' });
//       }
//     });
//   } else {
//     res.status(401).json({ error: 'Invalid credentials' });
//   }
// });

// // Transaction Route
// app.post('/api/transaction', (req, res) => {
//   const { amount } = req.body;

//   if (isNaN(amount) || amount <= 0) {
//     return res.status(400).json({ error: 'Invalid amount' });
//   }

//   res.json({ success: true, message: 'Transaction processed' });
// });

// const PORT = process.env.PORT || 5000;
// https.listen(PORT, () => console.log(`Secure server running on https://localhost:${PORT}`));



const express = require('express');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https-localhost')();
const morgan = require('morgan'); // Import morgan for logging

dotenv.config();

const app = express();

// Middleware
app.use(helmet()); // Adds security headers
app.use(cors()); // Enables CORS for all origins
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('combined')); // Use morgan for logging requests

// Rate Limiting - logs rate limiting actions
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    console.log(`Rate limit hit by IP: ${req.ip}`);
    res.status(429).json({ error: 'Too many requests. Try again later.' });
  }
});
app.use(limiter);

// Dummy hashed password
const hashedPassword = bcrypt.hashSync('test_password', 10);

// Logging Middleware for bcrypt comparison
const logBcryptComparison = (email, result, err) => {
  if (err) {
    console.error(`Bcrypt comparison failed for user ${email}:`, err);
  } else if (result) {
    console.log(`User ${email} successfully authenticated.`);
  } else {
    console.log(`User ${email} failed authentication: Invalid credentials.`);
  }
};

// User Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log(`Login request received for user: ${email}`);

  // Dummy check - replace with real database lookup
  if (email === 'test@example.com') {
    bcrypt.compare(password, hashedPassword, (err, result) => {
      logBcryptComparison(email, result, err); // Log comparison result

      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      if (result) {
        res.json({ success: true });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  } else {
    console.log(`User ${email} does not exist.`);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Transaction Route with input validation
app.post('/api/transaction', (req, res) => {
  const { amount } = req.body;
  console.log(`Transaction request received for amount: ${amount}`);

  // Input validation
  if (isNaN(amount) || amount <= 0) {
    console.log(`Invalid transaction amount: ${amount}`);
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // Process transaction (Dummy response for now)
  console.log(`Transaction for ${amount} processed successfully.`);
  res.json({ success: true, message: 'Transaction processed' });
});

// 404 handler
app.use((req, res, next) => {
  console.log(`404 Error: ${req.method} ${req.originalUrl} not found.`);
  res.status(404).json({ error: 'Not Found' });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(`Internal server error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
// https.listen(PORT, () => console.log(`Secure server running on https://localhost:${PORT}`));

https.listen(PORT, () => console.log(`Secure server running on https://localhost:${PORT}`));
