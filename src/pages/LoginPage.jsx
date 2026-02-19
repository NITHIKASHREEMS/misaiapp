import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaMotorcycle, FaUserShield } from 'react-icons/fa';

const LoginPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('user'); // user, agent, admin
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        // Validation Logic as per requirements
        // Password for all: "b2g"
        if (password !== 'b2g') {
            setError('Invalid password');
            return;
        }

        if (role === 'user' && email === 'user') {
            navigate('/user');
        } else if (role === 'agent' && email === 'agent') {
            navigate('/agent');
        } else if (role === 'admin' && email === 'admin') {
            navigate('/admin');
        } else {
            setError('Invalid credentials for selected role');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFF8F1 0%, #FFE0B2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '3rem',
                    background: 'white'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800' }}>Welcome Back</h2>
                    <p style={{ color: '#666' }}>Secure Access Portal</p>
                </div>

                {/* Role Selection */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', justifyContent: 'center' }}>
                    <RoleButton active={role === 'user'} onClick={() => setRole('user')} icon={<FaUser />} label="User" />
                    <RoleButton active={role === 'agent'} onClick={() => setRole('agent')} icon={<FaMotorcycle />} label="Agent" />
                    <RoleButton active={role === 'admin'} onClick={() => setRole('admin')} icon={<FaUserShield />} label="Admin" />
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#555' }}>Username / ID</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={role === 'user' ? 'Enter "user"' : role === 'agent' ? 'Enter "agent"' : 'Enter "admin"'}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                outlineColor: 'var(--primary)'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.9rem', color: '#555' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                outlineColor: 'var(--primary)'
                            }}
                        />
                    </div>

                    {error && <p style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                        Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
                    By logging in, you agree to our Terms & Safety Protocols.
                </p>
            </motion.div>
        </div>
    );
};

const RoleButton = ({ active, onClick, icon, label }) => (
    <button
        type="button"
        onClick={onClick}
        style={{
            flex: 1,
            padding: '10px 5px',
            borderRadius: '10px',
            border: active ? '2px solid var(--primary)' : '1px solid #ddd',
            background: active ? '#FFF3E0' : 'transparent',
            color: active ? 'var(--primary)' : '#666',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.2s',
            fontSize: '0.8rem',
            fontWeight: '600'
        }}
    >
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        {label}
    </button>
);

export default LoginPage;
