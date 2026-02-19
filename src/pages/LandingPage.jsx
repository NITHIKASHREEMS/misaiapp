import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaTruck, FaUsers, FaLeaf } from 'react-icons/fa';

const LandingPage = () => {
    return (
        <div className="page-container">
            {/* Navbar */}
            <nav style={{ padding: '1.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Logo Placeholder */}
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary-gradient)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)' }}>MISAI</h1>
                </div>
                <Link to="/login" className="btn-primary">Login</Link>
            </nav>

            {/* Hero Section */}
            <header style={{
                padding: '5rem 5%',
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #FFF3E0, #FFFFFF)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gradient-text"
                    style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: '1.2' }}
                >
                    Rescuing Food,<br />Nourishing Communities
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ maxWidth: '600px', fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}
                >
                    MISAI connects donors with surplus food to local receivers and delivery agents in real-time. Join the movement to end hunger and reduce waste.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link to="/login" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>Get Started</Link>
                </motion.div>
            </header>

            {/* Stats Section */}
            <section style={{ padding: '4rem 5%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                <StatCard icon={<FaHandHoldingHeart />} number="1.2M+" label="Meals Rescued" delay={0} />
                <StatCard icon={<FaUsers />} number="50k+" label="Active Users" delay={0.1} />
                <StatCard icon={<FaTruck />} number="120+" label="Cities Covered" delay={0.2} />
                <StatCard icon={<FaLeaf />} number="800T" label="CO2 Saved" delay={0.3} />
            </section>

            {/* Mission Section */}
            <section style={{ padding: '4rem 5%', background: '#FFF8F1', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--secondary)' }}>Our Mission</h2>
                    <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '1.5rem' }}>
                        We believe that hunger is a logistics problem, not a scarcity problem. MISAI leverages advanced technology, AI validation, and hyperlocal logistics to bridge the gap between surplus and scarcity.
                    </p>
                    <ul style={{ listStyle: 'none', space: 'y-2' }}>
                        <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>✅ <strong>Smart Matching:</strong> AI-driven connection between donors and receivers.</li>
                        <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>✅ <strong>Safety First:</strong> Automated hygiene checks and spoilage prediction.</li>
                        <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>✅ <strong>Hyperlocal:</strong> Real-time tracking within 35km radius.</li>
                    </ul>
                </div>
                <div style={{ flex: 1, minWidth: '300px', height: '400px', background: 'var(--primary-gradient)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Abstract Illustration Placeholder */}
                    <div style={{ color: 'white', textAlign: 'center' }}>
                        <FaHandHoldingHeart size={100} style={{ opacity: 0.8 }} />
                        <p style={{ marginTop: '20px', fontWeight: '600' }}>Impact in Real-Time</p>
                    </div>
                </div>
            </section>

            <footer style={{ background: 'var(--secondary)', color: 'white', padding: '3rem 5%', textAlign: 'center' }}>
                <p>&copy; 2026 MISAI Platform. All rights reserved.</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '10px' }}>Industrial Standard Food Redistribution</p>
            </footer>
        </div>
    );
};

const StatCard = ({ icon, number, label, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="glass-panel"
        style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
        <div style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>{number}</h3>
        <p style={{ color: '#666' }}>{label}</p>
    </motion.div>
);

export default LandingPage;
