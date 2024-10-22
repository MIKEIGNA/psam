import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UserForm from './components/UserForm';
import PaymentForm from './components/PaymentForm';
import RegisterForm from './components/RegisterForm'; 
import './scss/main.scss';

const Home = () => {
    return <h2>Welcome to Customer International Payments Portal</h2>;
};

function App() {
    const handleLogin = (userData) => {
        console.log('User Data Saved:', userData);
    };

    const handlePaymentSuccess = (data) => {
        console.log('Payment successful:', data);
    };
    const handleRegister = (data) => {
        console.log('Registration successful:', data);
    };
    return (
        <Router>
            <div className="App">
                <h1 style={{ textAlign: 'center' }}>Payment Portal</h1>
                <nav>
                    <ul style={{ listStyle: 'none' , display: 'flex', justifyContent: 'space-between' }}>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/payment">Payment</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<UserForm onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterForm onRegister={handleRegister} />} />
                    <Route path="/payment" element={<PaymentForm onPaymentSuccess={handlePaymentSuccess} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;