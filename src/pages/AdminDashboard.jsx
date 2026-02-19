import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartBar, FaUserCog, FaExclamationCircle, FaSignOutAlt, FaLeaf, FaCheck, FaBan, FaFilePdf, FaUsers, FaShieldAlt, FaTruck, FaSearch, FaFilter } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

// Chennai-area user data
const USERS = [
    { id: 'A001', name: 'Thiru R. Lalvena, IAS', tamilName: 'திரு R. லால்வேனா IAS', role: 'Admin', phone: '9400000001', area: 'Chennai', donations: 0, rating: 5.0, status: 'Active', joined: '2024-01-01', lastActive: 'Online' },
    { id: 'U001', name: 'Murugesan Pillai', tamilName: 'முருகேசன் பிள்ளை', role: 'Donor', phone: '9444123456', area: 'T. Nagar', donations: 47, rating: 4.9, status: 'Active', joined: '2024-01-15', lastActive: '2 hours ago' },
    { id: 'U002', name: 'Priya Suresh', tamilName: 'பிரியா சுரேஷ்', role: 'Receiver', phone: '9876543210', area: 'Adyar', donations: 0, rating: 4.7, status: 'Active', joined: '2024-02-20', lastActive: '30 min ago' },
    { id: 'U003', name: 'Karthikeyan Rajan', tamilName: 'கார்த்திகேயன் ராஜன்', role: 'Agent', phone: '9944556677', area: 'Mylapore', donations: 0, rating: 4.8, status: 'Active', joined: '2024-03-15', lastActive: 'Online' },
    { id: 'U004', name: 'Annamalai Selvam', tamilName: 'அண்ணாமலை செல்வம்', role: 'Donor', phone: '9500234567', area: 'Anna Nagar', donations: 23, rating: 4.5, status: 'Active', joined: '2024-04-10', lastActive: '1 day ago' },
    { id: 'U005', name: 'Meenakshi Devi', tamilName: 'மீனாட்சி தேவி', role: 'Receiver', phone: '9789012345', area: 'Tambaram', donations: 0, rating: 4.2, status: 'Suspended', joined: '2024-05-05', lastActive: '3 days ago' },
    { id: 'U006', name: 'Subramaniam Pillai', tamilName: 'சுப்பிரமணியம் பிள்ளை', role: 'Donor', phone: '9345678901', area: 'Velachery', donations: 89, rating: 4.95, status: 'Active', joined: '2023-11-20', lastActive: '5 hours ago' },
    { id: 'U007', name: 'Kavitha Natarajan', tamilName: 'கவிதா நடராஜன்', role: 'Agent', phone: '9677890123', area: 'Porur', donations: 0, rating: 4.6, status: 'Active', joined: '2024-06-01', lastActive: 'Online' },
    { id: 'U008', name: 'Balakrishnan Iyer', tamilName: 'பாலகிருஷ்ணன் ஐயர்', role: 'Donor', phone: '9123456789', area: 'Nungambakkam', donations: 34, rating: 4.7, status: 'Active', joined: '2024-01-30', lastActive: '2 days ago' },
];

const REPORTED_ISSUES = [
    { id: 'RPT001', type: 'Food Quality', reporter: 'Priya Suresh', reportedUser: 'Hotel Saravana Bhavan', description: 'Rice was stale and had an unusual smell. Packaging was not sealed properly.', severity: 'High', status: 'Under Review', date: '2026-02-18', area: 'T. Nagar' },
    { id: 'RPT002', type: 'Late Delivery', reporter: 'Karthikeyan Rajan', reportedUser: 'Agent Murugesan', description: 'Delivery was 2 hours late. Food reached in poor condition due to heat exposure.', severity: 'Medium', status: 'Resolved', date: '2026-02-17', area: 'Mylapore' },
    { id: 'RPT003', type: 'Fake Listing', reporter: 'Admin System', reportedUser: 'Unknown Donor', description: 'AI detected possible AI-generated image in food upload. Geo-tag mismatch detected.', severity: 'Critical', status: 'Investigating', date: '2026-02-18', area: 'Tambaram' },
    { id: 'RPT004', type: 'Quantity Mismatch', reporter: 'Meenakshi Devi', reportedUser: 'Anjappar Restaurant', description: 'Listed 40 servings but only 15 were delivered. Major discrepancy.', severity: 'High', status: 'Under Review', date: '2026-02-16', area: 'Anna Nagar' },
    { id: 'RPT005', type: 'Hygiene Concern', reporter: 'Suresh Kumar', reportedUser: 'Street Vendor #12', description: 'Food was uncovered during transport. No proper packaging observed.', severity: 'Medium', status: 'Resolved', date: '2026-02-15', area: 'Velachery' },
];

const VERIFICATION_QUEUE = [
    { id: '#8821', donor: 'Hotel Saravana Bhavan', item: 'Veg Biryani (4.5kg)', score: 91, status: 'Safe', area: 'T. Nagar', time: '11:30 AM' },
    { id: '#8822', donor: 'KFC Outlet 4, Anna Nagar', item: 'Fried Chicken (3kg)', score: 42, status: 'Flagged', area: 'Anna Nagar', time: '12:15 PM' },
    { id: '#8823', donor: 'Kalyana Mahal Wedding Hall', item: 'Sambar Rice (15kg)', score: 68, status: 'Review', area: 'Tambaram', time: '01:00 PM' },
    { id: '#8824', donor: 'Adyar Bakery', item: 'Bread & Buns (2kg)', score: 96, status: 'Safe', area: 'Adyar', time: '06:00 AM' },
    { id: '#8825', donor: 'Buhari Hotel', item: 'Mutton Biryani (8kg)', score: 89, status: 'Safe', area: 'Mount Road', time: '02:00 PM' },
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { listings, orders, agentDeliveries } = useApp();
    const [activeSection, setActiveSection] = useState('analytics');
    const [userSearch, setUserSearch] = useState('');
    const [userFilter, setUserFilter] = useState('all');
    const [issueFilter, setIssueFilter] = useState('all');

    const handleLogout = () => navigate('/login');

    const totalFoodRescued = listings.reduce((sum, l) => sum + (l.weight || 0), 0);
    const activeDonors = USERS.filter(u => u.role === 'Donor' && u.status === 'Active').length;
    const successfulDeliveries = agentDeliveries.length + 8902;
    const avgScore = listings.length > 0 ? Math.round(listings.reduce((sum, l) => sum + l.aiScore, 0) / listings.length) : 94;

    const generatePDF = () => {
        import('jspdf').then(({ jsPDF }) => {
            const doc = new jsPDF();
            const now = new Date().toLocaleString('en-IN');

            // Header
            doc.setFillColor(249, 115, 22);
            doc.rect(0, 0, 210, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('MISAI Platform Analytics Report', 15, 20);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generated: ${now}`, 15, 32);
            doc.text('Chennai Greater Area Operations', 120, 32);

            // Reset color
            doc.setTextColor(0, 0, 0);

            // Overview Section
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Platform Overview', 15, 55);
            doc.setDrawColor(249, 115, 22);
            doc.line(15, 58, 195, 58);

            const stats = [
                ['Total Food Rescued', `${(totalFoodRescued / 1000).toFixed(1)} kg`],
                ['Active Donors', activeDonors.toString()],
                ['Successful Deliveries', successfulDeliveries.toLocaleString()],
                ['Average AI Safety Score', `${avgScore}%`],
                ['Total Listings', listings.length.toString()],
                ['Pending Orders', orders.filter(o => o.status === 'pending').length.toString()],
                ['Reported Issues', REPORTED_ISSUES.length.toString()],
                ['Active Agents', USERS.filter(u => u.role === 'Agent').length.toString()],
            ];

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            stats.forEach(([label, value], i) => {
                const x = i % 2 === 0 ? 15 : 110;
                const y = 68 + Math.floor(i / 2) * 14;
                doc.setFillColor(248, 250, 252);
                doc.rect(x, y - 5, 90, 12, 'F');
                doc.setFont('helvetica', 'bold');
                doc.text(label + ':', x + 3, y + 3);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(249, 115, 22);
                doc.text(value, x + 65, y + 3);
                doc.setTextColor(0, 0, 0);
            });

            // Verification Queue
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Recent Verification Queue', 15, 140);
            doc.line(15, 143, 195, 143);

            const headers = ['ID', 'Donor', 'Item', 'AI Score', 'Status', 'Area'];
            const colWidths = [20, 50, 50, 20, 25, 30];
            let startX = 15;
            doc.setFontSize(9);
            doc.setFillColor(249, 115, 22);
            doc.rect(15, 146, 180, 8, 'F');
            doc.setTextColor(255, 255, 255);
            headers.forEach((h, i) => {
                doc.text(h, startX + 2, 152);
                startX += colWidths[i];
            });

            doc.setTextColor(0, 0, 0);
            VERIFICATION_QUEUE.forEach((row, ri) => {
                const y = 162 + ri * 10;
                if (ri % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(15, y - 4, 180, 10, 'F'); }
                startX = 15;
                const vals = [row.id, row.donor.substring(0, 20), row.item.substring(0, 20), `${row.score}/100`, row.status, row.area];
                vals.forEach((v, i) => {
                    if (i === 4) {
                        doc.setTextColor(row.status === 'Safe' ? 34 : row.status === 'Review' ? 249 : 239, row.status === 'Safe' ? 197 : row.status === 'Review' ? 115 : 68, row.status === 'Safe' ? 94 : row.status === 'Review' ? 22 : 68);
                    }
                    doc.text(v, startX + 2, y + 3);
                    doc.setTextColor(0, 0, 0);
                    startX += colWidths[i];
                });
            });

            // User Summary
            doc.addPage();
            doc.setFillColor(249, 115, 22);
            doc.rect(0, 0, 210, 20, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('User Management Summary', 15, 14);
            doc.setTextColor(0, 0, 0);

            doc.setFontSize(11);
            doc.text('Chennai Greater Area — Registered Users', 15, 35);

            const uHeaders = ['ID', 'Name', 'Role', 'Area', 'Status', 'Donations'];
            const uWidths = [20, 55, 25, 35, 25, 25];
            startX = 15;
            doc.setFillColor(30, 41, 59);
            doc.rect(15, 42, 180, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(9);
            uHeaders.forEach((h, i) => { doc.text(h, startX + 2, 48); startX += uWidths[i]; });

            doc.setTextColor(0, 0, 0);
            USERS.forEach((u, ri) => {
                const y = 58 + ri * 10;
                if (ri % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(15, y - 4, 180, 10, 'F'); }
                startX = 15;
                [u.id, u.name, u.role, u.area, u.status, u.donations.toString()].forEach((v, i) => {
                    if (i === 4) doc.setTextColor(u.status === 'Active' ? 34 : 239, u.status === 'Active' ? 197 : 68, u.status === 'Active' ? 94 : 68);
                    doc.text(v, startX + 2, y + 3);
                    doc.setTextColor(0, 0, 0);
                    startX += uWidths[i];
                });
            });

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('MISAI — Minimizing Surplus, Amplifying Impact | Chennai Operations | Confidential', 15, 280);

            doc.save(`MISAI_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        });
    };

    const filteredUsers = USERS.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.area.toLowerCase().includes(userSearch.toLowerCase());
        const matchFilter = userFilter === 'all' || u.role.toLowerCase() === userFilter || u.status.toLowerCase() === userFilter;
        return matchSearch && matchFilter;
    });

    const filteredIssues = REPORTED_ISSUES.filter(i => issueFilter === 'all' || i.severity.toLowerCase() === issueFilter || i.status.toLowerCase().includes(issueFilter));

    const navItems = [
        { id: 'analytics', icon: <FaChartBar />, label: 'Analytics Overview' },
        { id: 'users', icon: <FaUserCog />, label: 'User Management' },
        { id: 'issues', icon: <FaExclamationCircle />, label: 'Reported Issues', badge: REPORTED_ISSUES.filter(i => i.status !== 'Resolved').length },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                    width: '280px', background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '2rem',
                    display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100
                }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
                    <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                        style={{
                            width: '44px', height: '44px', background: 'linear-gradient(135deg, #f97316, #ea580c)', borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.3rem', fontWeight: '900'
                        }}>M</motion.div>
                    <div>
                        <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>MISAI Admin</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Control Panel</div>
                    </div>
                </div>

                {/* Admin Info */}
                <div style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '800', color: 'white' }}>RL</div>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Thiru R. Lalvena, IAS</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>திரு R. லால்வேனா IAS</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>Commissioner, Food Safety & Drug Admin, TN</div>
                        </div>
                    </div>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {navItems.map(item => (
                        <motion.button key={item.id} whileHover={{ x: 5 }} onClick={() => setActiveSection(item.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none',
                                background: activeSection === item.id ? 'rgba(249,115,22,0.2)' : 'transparent',
                                color: activeSection === item.id ? '#f97316' : 'rgba(255,255,255,0.7)',
                                fontWeight: activeSection === item.id ? '700' : '500', cursor: 'pointer', fontSize: '0.9rem',
                                borderLeft: activeSection === item.id ? '3px solid #f97316' : '3px solid transparent', transition: 'all 0.2s'
                            }}>
                            {item.icon}
                            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                            {item.badge > 0 && (
                                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                                    style={{ background: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '2px 7px', borderRadius: '10px', fontWeight: '700' }}>
                                    {item.badge}
                                </motion.span>
                            )}
                        </motion.button>
                    ))}
                </nav>

                <motion.button whileHover={{ scale: 1.02 }} onClick={handleLogout}
                    style={{ marginTop: 'auto', color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                    <FaSignOutAlt /> Secure Logout
                </motion.button>
            </motion.aside>

            {/* Main Content */}
            <main style={{ marginLeft: '280px', flex: 1, padding: '2.5rem' }}>
                <AnimatePresence mode="wait">

                    {/* ANALYTICS */}
                    {activeSection === 'analytics' && (
                        <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 4px' }}>Platform Overview</h1>
                                    <p style={{ color: '#6b7280', margin: 0 }}>Chennai Greater Area Operations</p>
                                </div>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={generatePDF}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(239,68,68,0.3)' }}>
                                    <FaFilePdf /> Generate PDF Report
                                </motion.button>
                            </div>

                            {/* Stats Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '2rem' }}>
                                {[
                                    { title: 'Total Food Rescued', value: `${(totalFoodRescued / 1000 + 1240).toFixed(1)} kg`, icon: '🌿', color: '#22c55e', trend: '+12%' },
                                    { title: 'Active Donors', value: (activeDonors + 342).toString(), icon: '👥', color: '#3b82f6', trend: '+8%' },
                                    { title: 'Successful Deliveries', value: successfulDeliveries.toLocaleString(), icon: '📦', color: '#f97316', trend: '+15%' },
                                    { title: 'Avg. Safety Score', value: `${avgScore}%`, icon: '🛡️', color: '#8b5cf6', trend: '+2%' },
                                ].map((card, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -5, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
                                        style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', borderTop: `4px solid ${card.color}`, transition: 'all 0.25s' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>{card.title}</span>
                                            <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                                        </div>
                                        <div style={{ fontSize: '2rem', fontWeight: '900', color: card.color, marginBottom: '4px' }}>{card.value}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: '700' }}>↑ {card.trend} this month</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Verification Queue */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontWeight: '800', marginBottom: '1.5rem', fontSize: '1.1rem' }}>🔍 Recent Verification Queue</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc' }}>
                                            {['ID', 'Donor', 'Item', 'AI Score', 'Status', 'Area', 'Time', 'Action'].map(h => (
                                                <th key={h} style={{ padding: '12px', textAlign: 'left', fontSize: '0.8rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {VERIFICATION_QUEUE.map((row, i) => (
                                            <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                                style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '12px', fontWeight: '700', color: '#374151' }}>{row.id}</td>
                                                <td style={{ padding: '12px', fontSize: '0.9rem' }}>{row.donor}</td>
                                                <td style={{ padding: '12px', fontSize: '0.9rem' }}>{row.item}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{ fontWeight: '800', color: row.score >= 80 ? '#22c55e' : row.score >= 60 ? '#f97316' : '#ef4444' }}>{row.score}/100</span>
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                                                        background: row.status === 'Safe' ? '#f0fdf4' : row.status === 'Review' ? '#fff7ed' : '#fef2f2',
                                                        color: row.status === 'Safe' ? '#22c55e' : row.status === 'Review' ? '#f97316' : '#ef4444'
                                                    }}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px', fontSize: '0.85rem', color: '#6b7280' }}>{row.area}</td>
                                                <td style={{ padding: '12px', fontSize: '0.85rem', color: '#6b7280' }}>{row.time}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        <motion.button whileHover={{ scale: 1.1 }} style={{ background: '#f0fdf4', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#22c55e', fontWeight: '700' }}><FaCheck /></motion.button>
                                                        <motion.button whileHover={{ scale: 1.1 }} style={{ background: '#fef2f2', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444', fontWeight: '700' }}><FaBan /></motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>

                            {/* Area-wise stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                                    style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                                    <h3 style={{ fontWeight: '800', marginBottom: '1rem', fontSize: '1rem' }}>📍 Top Areas by Donations</h3>
                                    {[
                                        { area: 'T. Nagar', count: 234, pct: 85 },
                                        { area: 'Anna Nagar', count: 189, pct: 68 },
                                        { area: 'Mylapore', count: 156, pct: 56 },
                                        { area: 'Adyar', count: 134, pct: 48 },
                                        { area: 'Velachery', count: 98, pct: 35 },
                                    ].map((a, i) => (
                                        <div key={i} style={{ marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{a.area}</span>
                                                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{a.count} donations</span>
                                            </div>
                                            <div style={{ height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${a.pct}%` }} transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
                                                    style={{ height: '100%', background: 'linear-gradient(90deg, #f97316, #ea580c)', borderRadius: '4px' }} />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>

                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                                    style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                                    <h3 style={{ fontWeight: '800', marginBottom: '1rem', fontSize: '1rem' }}>📊 Food Category Distribution</h3>
                                    {[
                                        { cat: 'High Risk (Cooked Meals)', pct: 58, color: '#ef4444' },
                                        { cat: 'Medium Risk (Veg Dishes)', pct: 30, color: '#f97316' },
                                        { cat: 'Low Risk (Dry/Packaged)', pct: 12, color: '#22c55e' },
                                    ].map((c, i) => (
                                        <div key={i} style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{c.cat}</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: c.color }}>{c.pct}%</span>
                                            </div>
                                            <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '5px', overflow: 'hidden' }}>
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                                                    style={{ height: '100%', background: c.color, borderRadius: '5px' }} />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* USER MANAGEMENT */}
                    {activeSection === 'users' && (
                        <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 4px' }}>👥 User Management</h1>
                                    <p style={{ color: '#6b7280', margin: 0 }}>Manage all registered users in Chennai area</p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                        <input placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                                            style={{ padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }} />
                                    </div>
                                    <select value={userFilter} onChange={e => setUserFilter(e.target.value)}
                                        style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', background: 'white' }}>
                                        <option value="all">All Users</option>
                                        <option value="admin">Admin</option>
                                        <option value="donor">Donors</option>
                                        <option value="receiver">Receivers</option>
                                        <option value="agent">Agents</option>
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '2rem' }}>
                                {[
                                    { label: 'Total Users', value: USERS.length, color: '#3b82f6', icon: '👥' },
                                    { label: 'Admin', value: USERS.filter(u => u.role === 'Admin').length, color: '#7c3aed', icon: '🛡️' },
                                    { label: 'Agents', value: USERS.filter(u => u.role === 'Agent').length, color: '#f97316', icon: '🏍️' },
                                    { label: 'Suspended', value: USERS.filter(u => u.status === 'Suspended').length, color: '#ef4444', icon: '🚫' },
                                ].map((s, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                        style={{ background: 'white', borderRadius: '14px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${s.color}` }}>
                                        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.icon}</div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: s.color }}>{s.value}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>{s.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc' }}>
                                            {['ID', 'Name', 'Tamil Name', 'Role', 'Phone', 'Area', 'Donations', 'Rating', 'Status', 'Last Active', 'Action'].map(h => (
                                                <th key={h} style={{ padding: '12px 10px', textAlign: 'left', fontSize: '0.75rem', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, i) => (
                                            <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                                                style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '12px 10px', fontWeight: '700', color: '#374151', fontSize: '0.85rem' }}>{user.id}</td>
                                                <td style={{ padding: '12px 10px', fontWeight: '700', fontSize: '0.9rem' }}>{user.name}</td>
                                                <td style={{ padding: '12px 10px', fontSize: '0.85rem', color: '#6b7280' }}>{user.tamilName}</td>
                                                <td style={{ padding: '12px 10px' }}>
                                                    <span style={{
                                                        padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                                                        background: user.role === 'Admin' ? '#f5f3ff' : user.role === 'Donor' ? '#f0fdf4' : user.role === 'Agent' ? '#fff7ed' : '#eff6ff',
                                                        color: user.role === 'Admin' ? '#7c3aed' : user.role === 'Donor' ? '#22c55e' : user.role === 'Agent' ? '#f97316' : '#3b82f6'
                                                    }}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 10px', fontSize: '0.85rem', color: '#374151' }}>{user.phone}</td>
                                                <td style={{ padding: '12px 10px', fontSize: '0.85rem', color: '#6b7280' }}>{user.area}</td>
                                                <td style={{ padding: '12px 10px', fontWeight: '700', color: '#374151', textAlign: 'center' }}>{user.donations}</td>
                                                <td style={{ padding: '12px 10px', fontWeight: '700', color: '#fbbf24' }}>⭐ {user.rating}</td>
                                                <td style={{ padding: '12px 10px' }}>
                                                    <span style={{
                                                        padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                                                        background: user.status === 'Active' ? '#f0fdf4' : '#fef2f2',
                                                        color: user.status === 'Active' ? '#22c55e' : '#ef4444'
                                                    }}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px 10px', fontSize: '0.8rem', color: '#9ca3af' }}>{user.lastActive}</td>
                                                <td style={{ padding: '12px 10px' }}>
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        <motion.button whileHover={{ scale: 1.1 }} style={{ background: '#f0fdf4', border: 'none', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', color: '#22c55e', fontSize: '0.75rem', fontWeight: '700' }}>Edit</motion.button>
                                                        <motion.button whileHover={{ scale: 1.1 }} style={{ background: user.status === 'Active' ? '#fef2f2' : '#f0fdf4', border: 'none', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', color: user.status === 'Active' ? '#ef4444' : '#22c55e', fontSize: '0.75rem', fontWeight: '700' }}>
                                                            {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                                        </motion.button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* REPORTED ISSUES */}
                    {activeSection === 'issues' && (
                        <motion.div key="issues" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: '0 0 4px' }}>⚠️ Reported Issues</h1>
                                    <p style={{ color: '#6b7280', margin: 0 }}>Monitor and resolve platform complaints</p>
                                </div>
                                <select value={issueFilter} onChange={e => setIssueFilter(e.target.value)}
                                    style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.9rem', background: 'white' }}>
                                    <option value="all">All Issues</option>
                                    <option value="critical">Critical</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="review">Under Review</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>

                            {/* Summary */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '2rem' }}>
                                {[
                                    { label: 'Total Issues', value: REPORTED_ISSUES.length, color: '#374151', icon: '📋' },
                                    { label: 'Critical', value: REPORTED_ISSUES.filter(i => i.severity === 'Critical').length, color: '#ef4444', icon: '🚨' },
                                    { label: 'Under Review', value: REPORTED_ISSUES.filter(i => i.status === 'Under Review').length, color: '#f97316', icon: '🔍' },
                                    { label: 'Resolved', value: REPORTED_ISSUES.filter(i => i.status === 'Resolved').length, color: '#22c55e', icon: '✅' },
                                ].map((s, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                        style={{ background: 'white', borderRadius: '14px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `4px solid ${s.color}` }}>
                                        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.icon}</div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: s.color }}>{s.value}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>{s.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {filteredIssues.map((issue, i) => (
                                    <motion.div key={issue.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                        whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                                        style={{
                                            background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                            borderLeft: `5px solid ${issue.severity === 'Critical' ? '#ef4444' : issue.severity === 'High' ? '#f97316' : '#fbbf24'}`,
                                            transition: 'all 0.2s'
                                        }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                                                    <span style={{ fontWeight: '800', fontSize: '1rem' }}>{issue.type}</span>
                                                    <span style={{ fontWeight: '700', fontSize: '0.75rem', color: '#6b7280' }}>#{issue.id}</span>
                                                    <span style={{
                                                        padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                                                        background: issue.severity === 'Critical' ? '#fef2f2' : issue.severity === 'High' ? '#fff7ed' : '#fffbeb',
                                                        color: issue.severity === 'Critical' ? '#ef4444' : issue.severity === 'High' ? '#f97316' : '#fbbf24'
                                                    }}>
                                                        {issue.severity}
                                                    </span>
                                                </div>
                                                <p style={{ color: '#374151', margin: '0 0 8px', fontSize: '0.9rem' }}>{issue.description}</p>
                                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#6b7280' }}>
                                                    <span>👤 Reporter: <strong>{issue.reporter}</strong></span>
                                                    <span>🎯 Against: <strong>{issue.reportedUser}</strong></span>
                                                    <span>📍 {issue.area}</span>
                                                    <span>📅 {issue.date}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                                                <span style={{
                                                    padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700',
                                                    background: issue.status === 'Resolved' ? '#f0fdf4' : issue.status === 'Investigating' ? '#fef2f2' : '#fff7ed',
                                                    color: issue.status === 'Resolved' ? '#22c55e' : issue.status === 'Investigating' ? '#ef4444' : '#f97316'
                                                }}>
                                                    {issue.status}
                                                </span>
                                            </div>
                                        </div>
                                        {issue.status !== 'Resolved' && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                                <motion.button whileHover={{ scale: 1.03 }}
                                                    style={{ padding: '8px 16px', background: '#f0fdf4', color: '#22c55e', border: '1px solid #86efac', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                                                    ✅ Mark Resolved
                                                </motion.button>
                                                <motion.button whileHover={{ scale: 1.03 }}
                                                    style={{ padding: '8px 16px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                                                    🚫 Suspend User
                                                </motion.button>
                                                <motion.button whileHover={{ scale: 1.03 }}
                                                    style={{ padding: '8px 16px', background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                                                    📧 Contact Reporter
                                                </motion.button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminDashboard;
