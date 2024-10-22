// import { useState } from 'react';
// import validator from 'validator';

// const UserForm = ({ onSave, user = {} }) => {
//     // const [userData, setUserData] = useState(user);
//     const [userData, setUserData] = useState({
//         email: user.email || '',      // Initialize with default value
//         password: user.password || ''   // Initialize with default value
//     });
//     const [errors, setErrors] = useState({});

//     const {email, password} = userData;

//     const validateData = () => {
//         let errors = {};

//         if (!validator.isEmail(email)) {
//             errors.email = 'A valid email is required';
//         }
//         if(!password) {
//             errors.password = 'Password is required';
//         }

//         return errors;

//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUserData({ ...userData, [name]: value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const errors = validateData();
//         if(Object.keys(errors).length) {
//             setErrors(errors);
//             return;
//         }
  
//         setErrors({});
//         console.log(userData);
//         onSave(userData);
//     };

//     return (
//         <div className="login-container">
//           <h2>Login</h2>
//           <form onSubmit={handleSubmit}>
//             <input 
//               type="email" 
//               value={email} 
//               name='email'
//               onChange={ handleChange} 
//               placeholder="Email"
//               required 
//             />
//             <div style={{ color: 'red' }}>{ errors.email }</div>

//             <input 
//               type="password" 
//               value={password}
//               name='password' 
//               onChange={handleChange} 
//               placeholder="Password"
//               required 
//             />
//             <div style={{ color: 'red' }}>{ errors.password }</div>

//             <button type="submit">Login</button>
//           </form>
//         </div>
//       );

// };

// export default UserForm;




// import { useState } from 'react';
// import axios from 'axios';
// import validator from 'validator';

// const UserForm = ({ onSave, user = {} }) => {
//     const [userData, setUserData] = useState({
//         email: user.email || '',
//         password: user.password || ''
//     });
//     const [errors, setErrors] = useState({});

//     const { email, password } = userData;

//     const validateData = () => {
//         let errors = {};

//         if (!validator.isEmail(email)) {
//             errors.email = 'A valid email is required';
//         }
//         if (!password) {
//             errors.password = 'Password is required';
//         }

//         return errors;
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUserData({ ...userData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const errors = validateData();
//         if (Object.keys(errors).length) {
//             setErrors(errors);
//             return;
//         }

//         setErrors({});
        
//         try {
//             const response = await axios.post('https://localhost:5000/api/login', userData); // Send login request
//             if (response.data.success) {
//                 console.log('Login successful'); // Handle success
//                 onSave(response.data); // Call onSave with the response
//             } else {
//                 setErrors({ email: 'Invalid credentials' }); // Handle failure
//             }
//         } catch (error) {
//             setErrors({ email: 'Server error, try again later' });
//         }
//     };

//     return (
//         <div className="login-container">
//             <h2>Login</h2>
//             <form onSubmit={handleSubmit}>
//                 <input 
//                     type="email" 
//                     value={email} 
//                     name="email"
//                     onChange={handleChange} 
//                     placeholder="Email"
//                     required 
//                 />
//                 <div style={{ color: 'red' }}>{errors.email}</div>

//                 <input 
//                     type="password" 
//                     value={password}
//                     name="password" 
//                     onChange={handleChange} 
//                     placeholder="Password"
//                     required 
//                 />
//                 <div style={{ color: 'red' }}>{errors.password}</div>

//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );
// };

// export default UserForm;





import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';

const UserForm = ({ onSave, user = {} }) => {
    const [userData, setUserData] = useState({
        email: user.email || '',
        password: user.password || ''
    });
    const [errors, setErrors] = useState({});

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
            return;
        }

        setErrors({});
        
        try {
            const response = await axios.post('https://localhost:5000/api/login', userData);
            if (response.data.success) {
                console.log('Login successful'); // Handle success
                onSave(response.data); // Call onSave with the response
            }
        } catch (error) {
            // Handle more specific errors from the backend
            if (error.response && error.response.data && error.response.data.error) {
                setErrors({ password: error.response.data.error }); // Set error based on backend response
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
        </div>
    );
};

export default UserForm;
