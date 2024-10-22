import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';

const RegisterForm = ({ onRegister }) => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const { email, password } = userData;

    const validateData = () => {
        let errors = {};
        if (!validator.isEmail(email)) {
            errors.email = 'A valid email address is required.';
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            errors.password = 'Password must be at least 8 characters long and include at least one letter and one number.';
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
            setSuccessMessage(''); // Clear success message if there's an error
            return;
        }
        setErrors({});
        try {
            const response = await axios.post('https://localhost:5000/api/register', userData);
            if (response.data.success) {
                setSuccessMessage('Registration successful!'); // Set success message
                setErrors({}); // Clear any previous errors
                setUserData({ email: '', password: '' }); // Optionally clear the form
                onRegister(response.data); // Call onRegister with the response
            }
        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);
            setErrors({ general: 'Error during registration, please try again.' });
            setSuccessMessage(''); // Clear success message if registration fails
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
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
                <div style={{ color: 'red' }}>{errors.general}</div>

                <button type="submit">Register</button>
            </form>

            {/* Display success message */}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </div>
    );
};

export default RegisterForm;
