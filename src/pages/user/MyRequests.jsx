import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { FaLeaf, FaDrumstickBite, FaWeight, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const statusConfig = {
    approved: { color: '#22c55e', bg: '#f0fdf4', border: '#86efac', label: '✅ APPROVED', badgeBg: '#22c55e' },
    review: { color: '#f97316', bg: '#fff7ed', border: '#fed7aa', label: '⏳ MANUAL REVIEW', badgeBg: '#f97316' },
    rejected: { color: '#ef4444', bg: '#fef2f2', border: '#fca5a5', label: '❌ REJECTED', badgeBg: '#ef4444' }
};

const MyRequests = () => {
    const { listings, orders } = useApp();

    // All listings (donor view) + all orders placed by receiver
    const allItems = [...listings, ...orders.filter(o => o.receiverName === 'You (Receiver)')];

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>📬 My Requests</h1>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>All your food submissions — approved, under review, or rejected</p>
            </motion.div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {Object.entries(statusConfig).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: v.bg, border: `1px solid ${v.border}` }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: v.color }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: v.color }}>{v.label}</span>
                    </div>
                ))}
            </div>

            {listings.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel"
                    style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
                    <h3 style={{ color: '#6b7280' }}>No requests yet</h3>
                    <p style={{ color: '#9ca3af' }}>Upload food to see your submission status here</p>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {listings.map((listing, i) => (
                        <RequestCard key={listing.id} listing={listing} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
};

const RequestCard = ({ listing, index }) => {
    const cfg = statusConfig[listing.status] || statusConfig.review;
    const timeSince = Math.round((Date.now() - new Date(listing.postedAt)) / 60000);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
            whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
            style={{
                background: cfg.bg, borderRadius: '16px', overflow: 'hidden', border: `2px solid ${cfg.border}`,
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', transition: 'all 0.2s'
            }}>

            {/* Status bar */}
            <div style={{ width: '8px', background: cfg.color, flexShrink: 0 }} />

            {/* Food icon */}
            <div style={{
                width: '110px', height: '110px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem',
                background: listing.isVeg ? '#dcfce7' : '#fee2e2'
            }}>
                {listing.image ? <img src={listing.image} alt={listing.food} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (listing.isVeg ? '🥗' : '🍗')}
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {listing.isVeg ? <FaLeaf color="#22c55e" size={14} /> : <FaDrumstickBite color="#ef4444" size={14} />}
                        <h3 style={{ fontWeight: '800', fontSize: '1.1rem', margin: 0 }}>{listing.food}</h3>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0 0 8px' }}>{listing.donorName}</p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaWeight size={11} /> {listing.weight}g
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            👥 Serves {listing.serves}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaClock size={11} /> {timeSince < 60 ? `${timeSince}m ago` : `${Math.round(timeSince / 60)}h ago`}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FaMapMarkerAlt size={11} /> {listing.location}
                        </span>
                    </div>
                    {listing.status === 'rejected' && (
                        <div style={{ marginTop: '8px', padding: '6px 12px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '0.8rem', color: '#991b1b' }}>
                            ⚠️ Reason: AI score below safety threshold. Please check food freshness and storage conditions.
                        </div>
                    )}
                    {listing.status === 'review' && (
                        <div style={{ marginTop: '8px', padding: '6px 12px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', fontSize: '0.8rem', color: '#92400e' }}>
                            🔍 Admin review in progress. Expected within 30 minutes.
                        </div>
                    )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                    <div style={{ background: cfg.badgeBg, color: 'white', padding: '5px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px', whiteSpace: 'nowrap' }}>
                        {cfg.label}
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: cfg.color }}>{listing.aiScore}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>AI Score</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>{listing.category} Risk</div>
                </div>
            </div>
        </motion.div>
    );
};

export default MyRequests;
