import React from 'react';
import { NavLink, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlusCircle, FaList, FaHistory, FaSignOutAlt, FaMapMarkedAlt, FaUser } from 'react-icons/fa';
import DonorUpload from './user/DonorUpload';
import ReceiverMap from './user/ReceiverMap';
import MyListings from './user/MyListings';
import MyRequests from './user/MyRequests';

const UserDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => navigate('/login');

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                    width: '260px', background: 'white', padding: '2rem', display: 'flex', flexDirection: 'column',
                    borderRight: '1px solid #e2e8f0', position: 'fixed', height: '100vh', zIndex: 10, boxShadow: '4px 0 20px rgba(0,0,0,0.04)'
                }}>

                {/* Logo */}
                <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                        style={{
                            width: '40px', height: '40px', background: 'linear-gradient(135deg, #f97316, #ea580c)', borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.2rem'
                        }}>M</motion.div>
                    <div>
                        <h2 style={{ fontWeight: '900', color: '#1e293b', margin: 0, fontSize: '1.1rem' }}>MISAI</h2>
                        <p style={{ color: '#6b7280', margin: 0, fontSize: '0.75rem' }}>User Dashboard</p>
                    </div>
                </div>

                {/* User Info */}
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1rem' }}>
                        <FaUser />
                    </div>
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Donor / Receiver</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Chennai, Tamil Nadu</div>
                    </div>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px 12px' }}>Donor</p>
                    <NavItem to="/user/donate" icon={<FaPlusCircle />} label="Upload Food" />

                    <p style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '16px 0 8px 12px' }}>Receiver</p>
                    <NavItem to="/user/map" icon={<FaMapMarkedAlt />} label="Find Food (Map)" />

                    <p style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '16px 0 8px 12px' }}>My Activity</p>
                    <NavItem to="/user/listings" icon={<FaList />} label="My Listings" />
                    <NavItem to="/user/requests" icon={<FaHistory />} label="My Requests" />
                </nav>

                <motion.button whileHover={{ scale: 1.02 }} onClick={handleLogout}
                    style={{
                        marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444',
                        background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '12px 16px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem'
                    }}>
                    <FaSignOutAlt /> Logout
                </motion.button>
            </motion.aside>

            {/* Main Content */}
            <main style={{ marginLeft: '260px', flex: 1, padding: '2rem' }}>
                <Routes>
                    <Route path="/" element={<Navigate to="donate" />} />
                    <Route path="donate" element={<DonorUpload />} />
                    <Route path="map" element={<ReceiverMap />} />
                    <Route path="listings" element={<MyListings />} />
                    <Route path="requests" element={<MyRequests />} />
                </Routes>
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink to={to}
        style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 15px', borderRadius: '10px',
            color: isActive ? 'white' : '#6b7280',
            background: isActive ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent',
            fontWeight: isActive ? '700' : '500', transition: 'all 0.2s', textDecoration: 'none', fontSize: '0.9rem',
            boxShadow: isActive ? '0 4px 15px rgba(249,115,22,0.3)' : 'none'
        })}>
        {icon} {label}
    </NavLink>
);

export default UserDashboard;
