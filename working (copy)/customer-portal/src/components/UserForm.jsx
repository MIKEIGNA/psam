import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';

const UserForm = ({ onLogin, user = {} }) => {
    const [userData, setUserData] = useState({
        email: user.email || '',
        password: user.password || ''
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    const { email, password } = userData;

    const validateData = () => {
        let errors = {};

        if (!validator.isEmail(email)) {
            errors.email = 'A valid email address is required.';
        }
        if (!password) {
            errors.password = 'Password is required.';
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateData();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            setSuccessMessage(''); // Clear success message on validation error
            return;
        }

        setErrors({});
        
        try {
            const response = await axios.post('https://localhost:5000/api/login', userData);
            if (response.data.success) {
                console.log('Login successful');
                setSuccessMessage('Login successful!'); // Set success message
                onLogin(response.data); // Call onLogin with the response
            } else {
                setSuccessMessage(''); // Clear success message on failure
            }
        } catch (error) {
            // Handle more specific errors from the backend
            setSuccessMessage(''); // Clear success message on error
            if (error.response && error.response.data && error.response.data.error) {
                setErrors({ password: error.response.data.error });
            } else {
                setErrors({ password: 'Server error, please try again later.' });
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    value={email} 
                    name="email"
                    onChange={handleChange} 
                    placeholder="Email"
                    required 
                />
                <div style={{ color: 'red' }}>{errors.email}</div>

                <input 
                    type="password" 
                    value={password}
                    name="password" 
                    onChange={handleChange} 
                    placeholder="Password"
                    required 
                />
                <div style={{ color: 'red' }}>{errors.password}</div>

                <button type="submit">Login</button>
            </form>
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>} {/* Display success message */}
        </div>
    );
};

export default UserForm;
