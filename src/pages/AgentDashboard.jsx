import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaCheck, FaPhone, FaBox, FaUser, FaHistory, FaTimes, FaStar, FaMotorcycle, FaRupeeSign, FaRoute, FaCheckCircle, FaTimesCircle, FaChartLine, FaTrophy, FaMedal } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const badge = (text, bg, color = 'white') => (
    <span style={{ background: bg, color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>{text}</span>
);

const AgentDashboard = () => {
    const { orders, agentDeliveries, agentRejected, agentAccepted, acceptOrder, rejectOrder, markPickedUp, markDelivered, agentProfile, todayEarnings } = useApp();
    const [activeTab, setActiveTab] = useState('active');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mapTime, setMapTime] = useState(new Date());
    const [contactVisible, setContactVisible] = useState({});

    useEffect(() => {
        const timer = setInterval(() => setMapTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const activeOrders = orders.filter(o => o.status === 'accepted' || o.status === 'pickedup');
    const todayDeliveries = agentDeliveries.filter(d => new Date(d.deliveredAt).toDateString() === new Date().toDateString());

    const tabs = [
        { id: 'active', label: 'Active', icon: <FaBox />, count: pendingOrders.length + activeOrders.length },
        { id: 'history', label: 'History', icon: <FaHistory />, count: agentDeliveries.length },
        { id: 'accepted', label: 'Accepted', icon: <FaCheck />, count: agentAccepted.length },
        { id: 'rejected', label: 'Rejected', icon: <FaTimes />, count: agentRejected.length },
        { id: 'ratings', label: 'Ratings', icon: <FaStar />, count: null },
        { id: 'profile', label: 'Profile', icon: <FaUser />, count: null },
    ];

    const sidebarW = 260;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside initial={{ x: -sidebarW }} animate={{ x: 0 }} exit={{ x: -sidebarW }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ width: sidebarW, background: 'linear-gradient(180deg,#1e293b,#0f172a)', color: 'white', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100, overflowY: 'auto' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg,#f97316,#ea580c)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem' }}>M</div>
                            <div>
                                <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>MISAI Agent</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Delivery Dashboard</div>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🏍️</div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{agentProfile.name}</div>
                                    <div style={{ fontSize: '0.72rem', opacity: 0.65 }}>{agentProfile.tamilName}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {[
                                    { val: `₹${todayEarnings}`, sub: "Today's ₹", color: '#f97316' },
                                    { val: todayDeliveries.length, sub: 'Today', color: '#22c55e' },
                                    { val: `⭐${agentProfile.rating}`, sub: 'Rating', color: '#fbbf24' },
                                ].map((s, i) => (
                                    <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px', textAlign: 'center' }}>
                                        <div style={{ fontWeight: '800', color: s.color, fontSize: '0.88rem' }}>{s.val}</div>
                                        <div style={{ fontSize: '0.62rem', opacity: 0.7 }}>{s.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {tabs.map(tab => (
                                <motion.button key={tab.id} whileHover={{ x: 4 }} onClick={() => setActiveTab(tab.id)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', background: activeTab === tab.id ? 'rgba(249,115,22,0.2)' : 'transparent', color: activeTab === tab.id ? '#f97316' : 'rgba(255,255,255,0.7)', fontWeight: activeTab === tab.id ? '700' : '500', cursor: 'pointer', fontSize: '0.9rem', borderLeft: activeTab === tab.id ? '3px solid #f97316' : '3px solid transparent', transition: 'all 0.2s' }}>
                                    {tab.icon}
                                    <span style={{ flex: 1, textAlign: 'left' }}>{tab.label}</span>
                                    {tab.count !== null && tab.count > 0 && (
                                        <span style={{ background: activeTab === tab.id ? '#f97316' : '#374151', color: 'white', fontSize: '0.7rem', padding: '2px 7px', borderRadius: '10px', fontWeight: '700' }}>{tab.count}</span>
                                    )}
                                </motion.button>
                            ))}
                        </nav>

                        <button onClick={() => window.location.href = '/login'}
                            style={{ marginTop: '1rem', padding: '10px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem' }}>
                            Logout
                        </button>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Toggle */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ position: 'fixed', top: '20px', left: sidebarOpen ? sidebarW + 10 : '20px', zIndex: 200, background: '#f97316', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', transition: 'left 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(249,115,22,0.4)' }}>
                {sidebarOpen ? '◀' : '▶'}
            </button>

            {/* Main */}
            <main style={{ marginLeft: sidebarOpen ? sidebarW : 0, flex: 1, padding: '2rem', transition: 'margin 0.3s' }}>

                {/* Stats bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '2rem' }}>
                    {[
                        { label: "Today's Earnings", value: `₹${todayEarnings}`, color: '#22c55e', icon: '💰', sub: `${todayDeliveries.length} deliveries today` },
                        { label: 'Career Earnings', value: `₹${(agentProfile.careerEarnings).toLocaleString('en-IN')}`, color: '#f97316', icon: '🏆', sub: `${agentProfile.totalDeliveries} total deliveries` },
                        { label: 'Pending Orders', value: pendingOrders.length, color: '#3b82f6', icon: '⏳', sub: 'Awaiting your response' },
                        { label: 'Rating', value: `⭐ ${agentProfile.rating}`, color: '#fbbf24', icon: '🌟', sub: `${agentProfile.acceptanceRate}% acceptance rate` },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }}
                            style={{ background: 'white', borderRadius: '14px', padding: '1.2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', borderTop: `4px solid ${s.color}` }}>
                            <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{s.icon}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: '0.8rem', color: '#374151', fontWeight: '600', marginBottom: '2px' }}>{s.label}</div>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{s.sub}</div>
                        </motion.div>
                    ))}
                </div>

                {/* ACTIVE TAB */}
                {activeTab === 'active' && (
                    <div>
                        {/* Map */}
                        <div style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', borderRadius: '20px', overflow: 'hidden', marginBottom: '1.5rem', position: 'relative', height: '260px' }}>
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(249,115,22,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '20px', color: 'white', fontSize: '0.8rem', fontWeight: '700', border: '1px solid rgba(249,115,22,0.3)', zIndex: 5 }}>
                                🔴 LIVE • {mapTime.toLocaleTimeString('en-IN')}
                            </div>
                            <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: '20px', color: 'white', fontSize: '0.82rem', fontWeight: '700', border: '1px solid rgba(249,115,22,0.3)', zIndex: 5 }}>
                                🗺️ Chennai Navigation • {agentProfile.area}
                            </div>
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                                style={{ position: 'absolute', top: '50%', left: '45%', transform: 'translate(-50%,-50%)', zIndex: 10 }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(249,115,22,0.6)', fontSize: '1.3rem' }}>🏍️</div>
                                {[1, 2].map(r => (
                                    <motion.div key={r} animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2, delay: r * 0.8 }}
                                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #f97316', pointerEvents: 'none' }} />
                                ))}
                            </motion.div>
                            {pendingOrders.slice(0, 3).map((order, i) => {
                                const pos = [{ top: '30%', left: '65%' }, { top: '65%', left: '25%' }, { top: '25%', left: '30%' }][i] || { top: '40%', left: '70%' };
                                return (
                                    <motion.div key={order.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.2 }}
                                        style={{ position: 'absolute', ...pos, transform: 'translate(-50%,-50%)', zIndex: 8 }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(34,197,94,0.5)', fontSize: '1rem' }}>📦</div>
                                        <div style={{ textAlign: 'center', color: 'white', fontSize: '0.62rem', fontWeight: '700', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '8px', marginTop: '2px', whiteSpace: 'nowrap' }}>{order.distance}km • ₹{order.earnings}</div>
                                    </motion.div>
                                );
                            })}
                            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                                <motion.line x1="45%" y1="50%" x2="65%" y2="30%" stroke="#f97316" strokeWidth="2" strokeDasharray="6,4"
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity }} />
                            </svg>
                            <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', padding: '6px 20px', borderRadius: '20px', color: 'white', fontSize: '0.8rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {agentProfile.vehicleNo} • {agentProfile.vehicleType}
                            </div>
                        </div>

                        <h3 style={{ fontWeight: '800', marginBottom: '1rem', fontSize: '1.2rem' }}>📬 Incoming Orders ({pendingOrders.length})</h3>
                        {pendingOrders.length === 0 && (
                            <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', color: '#6b7280', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                <p style={{ fontWeight: '700' }}>No pending orders right now. You're all caught up!</p>
                                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>New orders will appear here in real-time.</p>
                            </div>
                        )}
                        {pendingOrders.map(order => (
                            <OrderCard key={order.id} order={order} mode="pending" onAccept={() => acceptOrder(order.id)} onReject={() => rejectOrder(order.id)} contactVisible={contactVisible} setContactVisible={setContactVisible} />
                        ))}
                        {activeOrders.length > 0 && (
                            <>
                                <h3 style={{ fontWeight: '800', marginBottom: '1rem', fontSize: '1.2rem', marginTop: '1.5rem' }}>🚀 Active Deliveries ({activeOrders.length})</h3>
                                {activeOrders.map(order => (
                                    <OrderCard key={order.id} order={order} mode={order.status} onPickup={() => markPickedUp(order.id)} onDeliver={() => markDelivered(order.id)} contactVisible={contactVisible} setContactVisible={setContactVisible} />
                                ))}
                            </>
                        )}
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontWeight: '800', margin: 0 }}>📜 Delivery History</h2>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ background: 'white', borderRadius: '10px', padding: '8px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                                    <div style={{ fontWeight: '900', color: '#22c55e', fontSize: '1.1rem' }}>₹{agentDeliveries.reduce((s, d) => s + d.earnings, 0)}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Shown Earnings</div>
                                </div>
                                <div style={{ background: 'white', borderRadius: '10px', padding: '8px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                                    <div style={{ fontWeight: '900', color: '#3b82f6', fontSize: '1.1rem' }}>{agentDeliveries.length}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Shown Deliveries</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {agentDeliveries.map((d, i) => (
                                <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                    style={{ background: 'white', borderRadius: '14px', padding: '1.2rem 1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: '800', fontSize: '1rem' }}>{d.food}</span>
                                            <span style={{ background: '#f0fdf4', color: '#22c55e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '700' }}>✅ Delivered</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '2px' }}>
                                            <strong>{d.donorName}</strong> → <strong>{d.receiverName}</strong>
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: '#9ca3af', display: 'flex', gap: '12px' }}>
                                            <span>📅 {new Date(d.deliveredAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                            <span>📍 {d.distance} km</span>
                                            <span>👥 {d.quantity} servings</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                                        <div style={{ fontWeight: '900', fontSize: '1.4rem', color: '#22c55e' }}>₹{d.earnings}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>earned</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {/* Career summary */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg,#1e293b,#0f172a)', borderRadius: '16px', padding: '1.5rem', color: 'white' }}>
                            <h3 style={{ fontWeight: '800', marginBottom: '1rem', color: '#f97316' }}>📊 Career Summary</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
                                {[
                                    { label: 'Total Deliveries', value: agentProfile.totalDeliveries, icon: '📦' },
                                    { label: 'Career Earnings', value: `₹${agentProfile.careerEarnings.toLocaleString('en-IN')}`, icon: '💰' },
                                    { label: 'This Month', value: `${agentProfile.monthlyDeliveries} deliveries`, icon: '📅' },
                                    { label: 'Monthly Earnings', value: `₹${agentProfile.monthlyEarnings.toLocaleString('en-IN')}`, icon: '💵' },
                                    { label: 'Acceptance Rate', value: `${agentProfile.acceptanceRate}%`, icon: '✅' },
                                    { label: 'On-Time Rate', value: `${agentProfile.onTimeRate}%`, icon: '⏱️' },
                                ].map((s, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{s.icon}</div>
                                        <div style={{ fontWeight: '900', color: '#f97316', fontSize: '1.1rem' }}>{s.value}</div>
                                        <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* ACCEPTED TAB */}
                {activeTab === 'accepted' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontWeight: '800', margin: 0 }}>✅ Accepted Deliveries</h2>
                            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700', color: '#166534' }}>
                                {agentAccepted.length} active • ₹{agentAccepted.reduce((s, d) => s + (d.earnings || 0), 0)} pending
                            </div>
                        </div>
                        {agentAccepted.length === 0 ? (
                            <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', color: '#6b7280', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                                <p style={{ fontWeight: '700' }}>No accepted deliveries in queue.</p>
                                <p style={{ fontSize: '0.85rem' }}>Accept incoming orders from the Active tab to see them here.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {agentAccepted.map(d => (
                                    <OrderCard key={d.id} order={d} mode={d.status === 'pickedup' ? 'pickedup' : 'accepted'}
                                        onPickup={() => markPickedUp(d.id)} onDeliver={() => markDelivered(d.id)}
                                        contactVisible={contactVisible} setContactVisible={setContactVisible} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* REJECTED TAB */}
                {activeTab === 'rejected' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontWeight: '800', margin: 0 }}>❌ Rejected / Declined</h2>
                            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '8px 16px', fontSize: '0.85rem', fontWeight: '700', color: '#991b1b' }}>
                                ₹{agentRejected.reduce((s, d) => s + (d.earnings || 0), 0)} missed earnings
                            </div>
                        </div>
                        {agentRejected.length === 0 ? (
                            <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', color: '#6b7280', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                                <p style={{ fontWeight: '700' }}>No rejected deliveries — great acceptance rate!</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {agentRejected.map((d, i) => (
                                    <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        style={{ background: 'white', borderRadius: '14px', border: '1px solid #fca5a5', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                                        <div style={{ background: '#fef2f2', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #fca5a5' }}>
                                            <span style={{ fontWeight: '800', color: '#991b1b' }}>{d.food}</span>
                                            <span style={{ background: '#ef4444', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>❌ Declined</span>
                                        </div>
                                        <div style={{ padding: '12px 16px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '2px' }}>DONOR</div>
                                                    <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{d.donorName}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '2px' }}>RECEIVER</div>
                                                    <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>{d.receiverName}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>📍 {d.distance} km</span>
                                                    <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>📅 {new Date(d.rejectedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontWeight: '900', color: '#ef4444', fontSize: '1.1rem' }}>-₹{d.earnings}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>missed</div>
                                                </div>
                                            </div>
                                            {d.rejectionReason && (
                                                <div style={{ marginTop: '8px', background: '#fef2f2', borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem', color: '#991b1b', fontWeight: '600' }}>
                                                    Reason: {d.rejectionReason}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* RATINGS TAB */}
                {activeTab === 'ratings' && (
                    <div>
                        <h2 style={{ fontWeight: '800', marginBottom: '1.5rem' }}>⭐ My Ratings & Reviews</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ fontSize: '4rem', fontWeight: '900', color: '#fbbf24', lineHeight: 1 }}>{agentProfile.rating}</div>
                                <div style={{ fontSize: '1.8rem', margin: '8px 0' }}>{'⭐'.repeat(5)}</div>
                                <div style={{ color: '#6b7280', fontWeight: '600' }}>Overall Rating</div>
                                <div style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '4px' }}>Based on 312 deliveries</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                                <div style={{ fontWeight: '700', marginBottom: '12px', color: '#374151' }}>Rating Breakdown</div>
                                {[
                                    { star: 5, count: 234, pct: 75 },
                                    { star: 4, count: 56, pct: 18 },
                                    { star: 3, count: 15, pct: 5 },
                                    { star: 2, count: 4, pct: 1 },
                                    { star: 1, count: 3, pct: 1 },
                                ].map(r => (
                                    <div key={r.star} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                                        <span style={{ fontSize: '0.8rem', width: '10px', color: '#374151', fontWeight: '700' }}>{r.star}</span>
                                        <span style={{ fontSize: '0.8rem' }}>⭐</span>
                                        <div style={{ flex: 1, height: '8px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${r.pct}%` }} transition={{ duration: 0.8, delay: r.star * 0.1 }}
                                                style={{ height: '100%', background: '#fbbf24', borderRadius: '4px' }} />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: '#6b7280', width: '28px', textAlign: 'right' }}>{r.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Performance metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '1.5rem' }}>
                            {[
                                { label: 'On-Time Delivery', value: `${agentProfile.onTimeRate}%`, color: '#22c55e', icon: '⏱️' },
                                { label: 'Acceptance Rate', value: `${agentProfile.acceptanceRate}%`, color: '#3b82f6', icon: '✅' },
                                { label: 'Avg. Delivery Time', value: '28 min', color: '#f97316', icon: '🚀' },
                            ].map((m, i) => (
                                <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center', borderTop: `3px solid ${m.color}` }}>
                                    <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{m.icon}</div>
                                    <div style={{ fontWeight: '900', fontSize: '1.4rem', color: m.color }}>{m.value}</div>
                                    <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '600' }}>{m.label}</div>
                                </div>
                            ))}
                        </div>
                        {/* Reviews */}
                        <h3 style={{ fontWeight: '800', marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Reviews</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { name: 'Priya Suresh', rating: 5, comment: 'Very prompt delivery! Food was still warm. Thank you so much Murugesan anna!', time: '2 days ago', food: 'Mutton Biryani' },
                                { name: 'Karthik Rajan', rating: 5, comment: 'Excellent service. Murugesan anna was very polite and careful with the food.', time: '3 days ago', food: 'Veg Biryani' },
                                { name: 'Meena Devi', rating: 4, comment: 'Good delivery, slightly late due to traffic but overall very good service.', time: '5 days ago', food: 'Idli & Sambar' },
                                { name: 'Suresh Kumar', rating: 5, comment: 'Amazing! Food reached on time and was properly packaged. Will order again.', time: '1 week ago', food: 'Chicken Curry' },
                            ].map((r, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                    style={{ background: 'white', borderRadius: '14px', padding: '1.2rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-start' }}>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1e293b' }}>{r.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>{r.food} • {r.time}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                            {Array.from({ length: 5 }).map((_, s) => (
                                                <span key={s} style={{ color: s < r.rating ? '#fbbf24' : '#e5e7eb', fontSize: '0.9rem' }}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ color: '#374151', fontSize: '0.88rem', margin: 0, lineHeight: 1.5 }}>"{r.comment}"</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div>
                        <h2 style={{ fontWeight: '800', marginBottom: '1.5rem' }}>👤 Agent Profile</h2>
                        {/* Hero card */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            style={{ background: 'linear-gradient(135deg,#1e293b,#0f172a)', borderRadius: '20px', padding: '2rem', color: 'white', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(249,115,22,0.1)' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', boxShadow: '0 4px 20px rgba(249,115,22,0.4)', flexShrink: 0 }}>🏍️</div>
                                <div>
                                    <h2 style={{ margin: '0 0 4px', fontWeight: '900', fontSize: '1.5rem' }}>{agentProfile.name}</h2>
                                    <p style={{ margin: '0 0 8px', opacity: 0.7, fontSize: '0.95rem' }}>{agentProfile.tamilName}</p>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        <span style={{ background: 'rgba(251,191,36,0.2)', border: '1px solid rgba(251,191,36,0.4)', color: '#fbbf24', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>🏆 {agentProfile.badge}</span>
                                        <span style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#22c55e', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>⭐ {agentProfile.rating} Rating</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
                                {[
                                    { val: agentProfile.totalDeliveries, label: 'Total Deliveries', color: '#f97316' },
                                    { val: `₹${agentProfile.careerEarnings.toLocaleString('en-IN')}`, label: 'Career Earnings', color: '#22c55e' },
                                    { val: `${agentProfile.acceptanceRate}%`, label: 'Acceptance Rate', color: '#3b82f6' },
                                    { val: `${agentProfile.onTimeRate}%`, label: 'On-Time Rate', color: '#fbbf24' },
                                ].map((s, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontWeight: '900', color: s.color, fontSize: '1.1rem' }}>{s.val}</div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '2px' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Details grid */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                            <h3 style={{ fontWeight: '800', marginBottom: '1rem', fontSize: '1rem', color: '#374151' }}>Personal Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {[
                                    { label: '📞 Phone', value: agentProfile.phone },
                                    { label: '📍 Area', value: agentProfile.area },
                                    { label: '🏍️ Vehicle Type', value: agentProfile.vehicleType },
                                    { label: '🔢 Vehicle No.', value: agentProfile.vehicleNo },
                                    { label: '📅 Member Since', value: new Date(agentProfile.joinedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) },
                                    { label: '📦 This Month', value: `${agentProfile.monthlyDeliveries} deliveries • ₹${agentProfile.monthlyEarnings.toLocaleString('en-IN')}` },
                                ].map((item, i) => (
                                    <div key={i} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '600', marginBottom: '4px' }}>{item.label}</div>
                                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const OrderCard = ({ order, mode, onAccept, onReject, onPickup, onDeliver, contactVisible, setContactVisible }) => {
    const [showContact, setShowContact] = useState(false);
    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', marginBottom: '12px', border: mode === 'pending' ? '2px solid #f97316' : mode === 'accepted' ? '2px solid #3b82f6' : mode === 'pickedup' ? '2px solid #22c55e' : '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
            <div style={{ padding: '1rem 1.5rem', background: mode === 'pending' ? '#fff7ed' : mode === 'accepted' ? '#eff6ff' : mode === 'pickedup' ? '#f0fdf4' : '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{order.food}</span>
                    <span style={{ marginLeft: '10px', fontSize: '0.78rem', color: '#6b7280' }}>#{order.id}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', color: '#f97316', fontSize: '1.1rem' }}>{order.distance}km</span>
                    <span style={{ background: '#22c55e', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700' }}>₹{order.earnings}</span>
                    <span style={{
                        padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                        background: mode === 'pending' ? '#fff7ed' : mode === 'accepted' ? '#eff6ff' : '#f0fdf4',
                        color: mode === 'pending' ? '#c2410c' : mode === 'accepted' ? '#1d4ed8' : '#166534',
                        border: `1px solid ${mode === 'pending' ? '#fb923c' : mode === 'accepted' ? '#60a5fa' : '#4ade80'}`
                    }}>
                        {mode === 'pending' ? '⏳ Pending' : mode === 'accepted' ? '✅ Accepted' : '📦 Picked Up'}
                    </span>
                </div>
            </div>
            <div style={{ padding: '1rem 1.5rem' }}>
                {(mode === 'accepted' || mode === 'pickedup') && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '10px' }}>
                            <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '700', marginBottom: '4px' }}>📦 PICKUP FROM</div>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#166534' }}>{order.donorName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#374151', marginTop: '2px' }}>{order.pickupAddress}</div>
                        </div>
                        <div style={{ background: '#eff6ff', borderRadius: '10px', padding: '10px' }}>
                            <div style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '700', marginBottom: '4px' }}>🏠 DELIVER TO</div>
                            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1d4ed8' }}>{order.receiverName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#374151', marginTop: '2px' }}>{order.receiverAddress}</div>
                        </div>
                    </div>
                )}
                {mode === 'pending' && (
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 4px' }}>📍 {order.pickupAddress}</p>
                        <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>👥 {order.quantity} servings • ⏱ {new Date(order.createdAt).toLocaleTimeString('en-IN')}</p>
                    </div>
                )}
                {(mode === 'accepted' || mode === 'pickedup') && (
                    <div style={{ marginBottom: '1rem' }}>
                        <button onClick={() => setShowContact(!showContact)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: showContact ? '#1e293b' : '#f3f4f6', color: showContact ? 'white' : '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', transition: 'all 0.2s' }}>
                            <FaPhone /> {showContact ? 'Hide Contact' : 'Show Contact'}
                        </button>
                        {showContact && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                style={{ marginTop: '8px', background: '#1e293b', borderRadius: '10px', padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginBottom: '2px' }}>Donor Contact</div>
                                    <div style={{ color: '#f97316', fontWeight: '800' }}>📞 {order.donorPhone}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginBottom: '2px' }}>Receiver Contact</div>
                                    <div style={{ color: '#22c55e', fontWeight: '800' }}>📞 {order.receiverPhone}</div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
                <div style={{ display: 'flex', gap: '10px' }}>
                    {mode === 'pending' && (
                        <>
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onAccept}
                                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <FaCheck /> Accept (₹{order.earnings})
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onReject}
                                style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <FaTimes /> Reject
                            </motion.button>
                        </>
                    )}
                    {mode === 'accepted' && (
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onPickup}
                            style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <FaBox /> Mark as Picked Up
                        </motion.button>
                    )}
                    {mode === 'pickedup' && (
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onDeliver}
                            style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <FaCheckCircle /> Mark as Delivered
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AgentDashboard;
