import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { FaLeaf, FaDrumstickBite, FaWeight, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const statusConfig = {
    approved: { color: '#22c55e', bg: '#f0fdf4', border: '#86efac', label: '✅ LIVE', badge: '#22c55e' },
    review: { color: '#f97316', bg: '#fff7ed', border: '#fed7aa', label: '⏳ UNDER REVIEW', badge: '#f97316' },
    rejected: { color: '#ef4444', bg: '#fef2f2', border: '#fca5a5', label: '❌ REJECTED', badge: '#ef4444' }
};

const MyListings = () => {
    const { listings } = useApp();
    const approvedListings = listings.filter(l => l.status === 'approved');

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>📋 My Listings</h1>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Your approved food donations — visible to receivers</p>
            </motion.div>

            {approvedListings.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel"
                    style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
                    <h3 style={{ color: '#6b7280' }}>No approved listings yet</h3>
                    <p style={{ color: '#9ca3af' }}>Upload food and get AI approval to see listings here</p>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {approvedListings.map((listing, i) => (
                        <FoodCard key={listing.id} listing={listing} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
};

const FoodCard = ({ listing, index }) => {
    const cfg = statusConfig[listing.status] || statusConfig.approved;
    const timeSince = Math.round((Date.now() - new Date(listing.postedAt)) / 60000);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
            whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
            style={{
                background: 'white', borderRadius: '16px', overflow: 'hidden', border: `2px solid ${cfg.border}`,
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', transition: 'all 0.2s'
            }}>

            {/* Left color bar */}
            <div style={{ width: '6px', background: cfg.color, flexShrink: 0 }} />

            {/* Image */}
            <div style={{
                width: '120px', height: '120px', flexShrink: 0, background: listing.isVeg ? '#f0fdf4' : '#fef2f2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'
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
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ background: cfg.badge, color: 'white', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>
                        {cfg.label}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: cfg.color }}>{listing.aiScore}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>AI Score</div>
                </div>
            </div>
        </motion.div>
    );
};

export default MyListings;
