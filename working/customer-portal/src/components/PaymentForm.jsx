// import { useState } from 'react';
// import axios from 'axios';
// import validator from 'validator';

// const PaymentForm = ({ onPaymentSuccess }) => {
//     const [amount, setAmount] = useState('');
//     const [cardNumber, setCardNumber] = useState('');
//     const [expiryDate, setExpiryDate] = useState('');
//     const [cvv, setCvv] = useState('');
//     const [errors, setErrors] = useState({});

//     const validateAmount = () => {
//         let errors = {};
//         if (!validator.isNumeric(amount)) {
//             errors.amount = 'Invalid amount';
//         } else if (parseFloat(amount) <= 0) {
//             errors.amount = 'Amount must be greater than zero';
//         }
//         return errors;
//     };

//     const validateCardDetails = () => {
//         let errors = {};
//         const cardNumberPattern = /^\d{16}$/;
//         const cvvPattern = /^\d{3,4}$/;
//         const [month, year] = expiryDate.split('/').map((num) => parseInt(num));
//         const now = new Date();
//         const expiry = new Date(year + 2000, month - 1);

//         if (!cardNumberPattern.test(cardNumber.replace(/\s/g, ''))) {
//             errors.cardNumber = 'Invalid card number. It must be 16 digits.';
//         }

//         if (!expiryDate || expiry < now) {
//             errors.expiryDate = 'Invalid expiry date. It must be in the future.';
//         }

//         if (!cvvPattern.test(cvv)) {
//             errors.cvv = 'CVV must be 3 or 4 digits.';
//         }

//         return errors;
//     };

//     const handlePayment = async (e) => {
//         e.preventDefault();

//         const amountErrors = validateAmount();
//         const cardErrors = validateCardDetails();
//         const allErrors = { ...amountErrors, ...cardErrors };

//         if (Object.keys(allErrors).length) {
//             setErrors(allErrors);
//             return;
//         }

//         setErrors({});

//         try {
//             const response = await axios.post('https://localhost:5000/api/transaction', {
//                 amount,
//                 cardNumber: cardNumber.replace(/\s/g, ''), // Remove spaces for the API call
//                 expiryDate,
//                 cvv,
//             });

//             if (response.data.success) {
//                 console.log('Transaction successful');
//                 onPaymentSuccess(response.data);
//             } else {
//                 setErrors({ amount: 'Transaction failed' });
//             }
//         } catch (err) {
//             setErrors({ amount: 'Error submitting transaction' });
//         }
//     };

//     // Function to format the card number as user types
//     const formatCardNumber = (value) => {
//         // Remove all non-digit characters
//         const digits = value.replace(/\D/g, '');
//         // Format the card number as 4 groups of 4 digits
//         return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
//     };

//     return (
//         <div className="payment-container">
//             <h2>Submit Payment</h2>
//             <form onSubmit={handlePayment}>
//                 <input
//                     type="text"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     placeholder="Enter Amount"
//                     required
//                 />
//                 <div style={{ color: 'red' }}>{errors.amount}</div>

//                 <input
//                     type="text"
//                     value={cardNumber}
//                     onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
//                     placeholder="Credit Card Number"
//                     required
//                 />
//                 <div style={{ color: 'red' }}>{errors.cardNumber}</div>

//                 <input
//                     type="text"
//                     value={expiryDate}
//                     onChange={(e) => setExpiryDate(e.target.value)}
//                     placeholder="MM/YY"
//                     required
//                 />
//                 <div style={{ color: 'red' }}>{errors.expiryDate}</div>

//                 <input
//                     type="text"
//                     value={cvv}
//                     onChange={(e) => setCvv(e.target.value)}
//                     placeholder="CVV"
//                     required
//                 />
//                 <div style={{ color: 'red' }}>{errors.cvv}</div>

//                 <button type="submit">Submit Payment</button>
//             </form>
//         </div>
//     );
// };

// export default PaymentForm;


import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';

const PaymentForm = ({ onPaymentSuccess }) => {
    const [amount, setAmount] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(''); // State for success message

    const validateAmount = () => {
        let errors = {};
        if (!validator.isNumeric(amount)) {
            errors.amount = 'Invalid amount';
        } else if (parseFloat(amount) <= 0) {
            errors.amount = 'Amount must be greater than zero';
        }
        return errors;
    };

    const validateCardDetails = () => {
        let errors = {};
        const cardNumberPattern = /^\d{16}$/;
        const cvvPattern = /^\d{3,4}$/;
        const [month, year] = expiryDate.split('/').map((num) => parseInt(num));
        const now = new Date();
        const expiry = new Date(year + 2000, month - 1);

        if (!cardNumberPattern.test(cardNumber.replace(/\s/g, ''))) {
            errors.cardNumber = 'Invalid card number. It must be 16 digits.';
        }

        if (!expiryDate || expiry < now) {
            errors.expiryDate = 'Invalid expiry date. It must be in the future.';
        }

        if (!cvvPattern.test(cvv)) {
            errors.cvv = 'CVV must be 3 or 4 digits.';
        }

        return errors;
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        const amountErrors = validateAmount();
        const cardErrors = validateCardDetails();
        const allErrors = { ...amountErrors, ...cardErrors };

        if (Object.keys(allErrors).length) {
            setErrors(allErrors);
            setSuccessMessage(''); // Clear success message if there are errors
            return;
        }

        setErrors({});
        setSuccessMessage(''); // Clear any previous success message

        try {
            const response = await axios.post('https://localhost:5000/api/transaction', {
                amount,
                cardNumber: cardNumber.replace(/\s/g, ''), // Remove spaces for the API call
                expiryDate,
                cvv,
            });

            if (response.data.success) {
                setSuccessMessage('Transaction successful!'); // Set success message
                setAmount(''); // Optionally clear the form after success
                setCardNumber('');
                setExpiryDate('');
                setCvv('');
                onPaymentSuccess(response.data); // Call onPaymentSuccess with the response
            } else {
                setErrors({ amount: 'Transaction failed' });
            }
        } catch (err) {
            setErrors({ amount: 'Error submitting transaction' });
            setSuccessMessage(''); // Clear success message if an error occurs
        }
    };

    // Function to format the card number as user types
    const formatCardNumber = (value) => {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');
        // Format the card number as 4 groups of 4 digits
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    };

    return (
        <div className="payment-container">
            <h2>Submit Payment</h2>
            <form onSubmit={handlePayment}>
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter Amount"
                    required
                />
                <div style={{ color: 'red' }}>{errors.amount}</div>

                <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="Credit Card Number"
                    required
                />
                <div style={{ color: 'red' }}>{errors.cardNumber}</div>

                <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    required
                />
                <div style={{ color: 'red' }}>{errors.expiryDate}</div>

                <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="CVV"
                    required
                />
                <div style={{ color: 'red' }}>{errors.cvv}</div>

                <button type="submit">Submit Payment</button>
            </form>

            {/* Display success message */}
            {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        </div>
    );
};

export default PaymentForm;
