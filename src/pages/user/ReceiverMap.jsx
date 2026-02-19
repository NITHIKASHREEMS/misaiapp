import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaList, FaMap, FaLeaf, FaDrumstickBite, FaWeight, FaClock,
    FaMapMarkerAlt, FaPhone, FaShoppingCart, FaTimes, FaUser,
    FaStar, FaFire, FaTag, FaRupeeSign, FaCheckCircle, FaBolt, FaHeart
} from 'react-icons/fa';
import { useApp, getFoodImage } from '../../context/AppContext';

const ReceiverMap = () => {
    const { listings, placeOrder } = useApp();
    const [viewMode, setViewMode] = useState('list');
    const [selectedListing, setSelectedListing] = useState(null);
    const [orderModal, setOrderModal] = useState(null);
    const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '', quantity: 1 });
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [filterVeg, setFilterVeg] = useState('all');
    const [wishlist, setWishlist] = useState([]);

    const approvedListings = listings
        .filter(l => l.status === 'approved')
        .filter(l => filterVeg === 'all' ? true : filterVeg === 'veg' ? l.isVeg : !l.isVeg)
        .sort((a, b) => a.distance - b.distance);

    const toggleWishlist = (id) => setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    const handleOrder = (e) => {
        e.preventDefault();
        const listing = orderModal;
        const order = {
            id: `ORD${Date.now()}`,
            listingId: listing.id,
            receiverName: orderForm.name,
            receiverPhone: orderForm.phone,
            receiverAddress: orderForm.address,
            quantity: parseInt(orderForm.quantity),
            status: 'pending',
            agentId: null,
            pickupAddress: listing.address,
            donorPhone: listing.donorPhone,
            donorName: listing.donorName,
            food: listing.food,
            distance: listing.distance,
            earnings: Math.round((listing.distance || 2) * 30),
            price: listing.price,
            createdAt: new Date().toISOString()
        };
        placeOrder(order);
        setOrderSuccess(true);
        setTimeout(() => {
            setOrderModal(null);
            setOrderSuccess(false);
            setOrderForm({ name: '', phone: '', address: '', quantity: 1 });
        }, 2800);
    };

    const timeSince = (iso) => {
        const m = Math.round((Date.now() - new Date(iso)) / 60000);
        return m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`;
    };

    const getImageSrc = (listing) => listing.image || listing.foodImage || getFoodImage(listing.food, listing.isVeg);
    const getAiScoreColor = (score) => score >= 85 ? '#22c55e' : score >= 70 ? '#f97316' : '#ef4444';
    const getAiScoreLabel = (score) => score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : 'Fair';

    return (
        <div style={{ maxWidth: '1060px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.9rem', fontWeight: '900', marginBottom: '4px', color: '#1e293b' }}>
                    Find Surplus Food Near You
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                    Fresh food at reduced prices • AI safety verified • Real-time availability
                </p>
            </motion.div>

            {/* Stats Banner */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
                    marginBottom: '1.5rem'
                }}>
                {[
                    { label: 'Available Now', value: approvedListings.length, color: '#22c55e', icon: '🟢' },
                    { label: 'Avg. Discount', value: `${Math.round(approvedListings.reduce((s, l) => s + (l.discount || 35), 0) / Math.max(approvedListings.length, 1))}% OFF`, color: '#f97316', icon: '🏷️' },
                    { label: 'Avg. Distance', value: `${(approvedListings.reduce((s, l) => s + l.distance, 0) / Math.max(approvedListings.length, 1)).toFixed(1)} km`, color: '#3b82f6', icon: '📍' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                        style={{
                            background: 'white', borderRadius: '14px', padding: '14px 18px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: `1px solid #e2e8f0`,
                            borderTop: `3px solid ${s.color}`, display: 'flex', alignItems: 'center', gap: '12px'
                        }}>
                        <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
                        <div>
                            <div style={{ fontWeight: '900', fontSize: '1.2rem', color: s.color }}>{s.value}</div>
                            <div style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '600' }}>{s.label}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* View Toggle */}
                <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '12px', padding: '4px', gap: '4px' }}>
                    {[
                        { id: 'list', icon: <FaList />, label: 'List' },
                        { id: 'map', icon: <FaMap />, label: 'Map' }
                    ].map(v => (
                        <button key={v.id} onClick={() => setViewMode(v.id)}
                            style={{
                                padding: '9px 20px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                                fontWeight: '700', fontSize: '0.88rem',
                                background: viewMode === v.id ? 'white' : 'transparent',
                                color: viewMode === v.id ? '#f97316' : '#6b7280',
                                boxShadow: viewMode === v.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                                display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s'
                            }}>
                            {v.icon} {v.label}
                        </button>
                    ))}
                </div>

                {/* Veg Filter */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                        { id: 'all', label: 'All', icon: '🍽️' },
                        { id: 'veg', label: 'Veg', icon: '🟢' },
                        { id: 'nonveg', label: 'Non-Veg', icon: '🔴' }
                    ].map(f => (
                        <button key={f.id} onClick={() => setFilterVeg(f.id)}
                            style={{
                                padding: '9px 16px', borderRadius: '22px',
                                border: `2px solid ${filterVeg === f.id ? '#f97316' : '#e2e8f0'}`,
                                background: filterVeg === f.id ? '#fff7ed' : 'white',
                                color: filterVeg === f.id ? '#f97316' : '#6b7280',
                                fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', gap: '6px'
                            }}>
                            {f.icon} {f.label}
                        </button>
                    ))}
                </div>

                <div style={{ marginLeft: 'auto', fontSize: '0.88rem', color: '#6b7280', fontWeight: '600' }}>
                    {approvedListings.length} listings within 35km
                </div>
            </div>

            {/* ===== LIST VIEW ===== */}
            {viewMode === 'list' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gap: '16px' }}>
                    {approvedListings.length === 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            style={{ background: 'white', borderRadius: '20px', padding: '4rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍽️</div>
                            <h3 style={{ fontWeight: '800', color: '#374151', marginBottom: '0.5rem' }}>No listings available</h3>
                            <p style={{ color: '#6b7280' }}>Check back soon — donors upload food throughout the day!</p>
                        </motion.div>
                    )}
                    {approvedListings.map((listing, i) => (
                        <motion.div key={listing.id}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
                            style={{
                                background: 'white', borderRadius: '18px', overflow: 'hidden',
                                border: '1px solid #e2e8f0', boxShadow: '0 3px 12px rgba(0,0,0,0.07)',
                                display: 'flex', transition: 'all 0.25s', cursor: 'pointer', position: 'relative'
                            }}
                            onClick={() => setSelectedListing(selectedListing?.id === listing.id ? null : listing)}>

                            {/* Food Image — REAL photo */}
                            <div style={{ width: '150px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                                <img
                                    src={getImageSrc(listing)}
                                    alt={listing.food}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '160px' }}
                                    onError={e => { e.target.src = getFoodImage(listing.food, listing.isVeg); }}
                                />
                                {/* Veg/Non-veg indicator */}
                                <div style={{
                                    position: 'absolute', top: '8px', left: '8px',
                                    width: '22px', height: '22px', borderRadius: '4px',
                                    background: 'white', border: `2px solid ${listing.isVeg ? '#22c55e' : '#ef4444'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: listing.isVeg ? '#22c55e' : '#ef4444' }} />
                                </div>
                                {/* AI Score badge */}
                                <div style={{
                                    position: 'absolute', bottom: '8px', left: '8px',
                                    background: getAiScoreColor(listing.aiScore),
                                    color: 'white', padding: '3px 8px', borderRadius: '8px',
                                    fontSize: '0.7rem', fontWeight: '800'
                                }}>AI {listing.aiScore}</div>
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, padding: '1.1rem 1.3rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontWeight: '900', fontSize: '1.1rem', margin: '0 0 2px', color: '#1e293b' }}>{listing.food}</h3>
                                        <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: '0 0 4px', fontWeight: '600' }}>
                                            {listing.donorName}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <FaStar key={s} size={10} color={s <= 4 ? '#fbbf24' : '#e5e7eb'} />
                                            ))}
                                            <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '4px' }}>4.2 (128 ratings)</span>
                                        </div>
                                    </div>
                                    {/* Wishlist */}
                                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                        onClick={ev => { ev.stopPropagation(); toggleWishlist(listing.id); }}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                        <FaHeart size={18} color={wishlist.includes(listing.id) ? '#ef4444' : '#e2e8f0'} />
                                    </motion.button>
                                </div>

                                {/* Tags row */}
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#374151', padding: '3px 8px', borderRadius: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FaWeight size={9} /> {listing.weight}g
                                    </span>
                                    <span style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#374151', padding: '3px 8px', borderRadius: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        👥 Serves {listing.serves}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#374151', padding: '3px 8px', borderRadius: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FaClock size={9} /> {timeSince(listing.postedAt)}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <FaMapMarkerAlt size={9} /> {listing.distance} km
                                    </span>
                                    <span style={{
                                        fontSize: '0.75rem', padding: '3px 8px', borderRadius: '20px', fontWeight: '700',
                                        background: `${getAiScoreColor(listing.aiScore)}20`,
                                        color: getAiScoreColor(listing.aiScore)
                                    }}>
                                        ✓ {getAiScoreLabel(listing.aiScore)} Quality
                                    </span>
                                </div>

                                {/* Price section — Zomato/Swiggy style */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                            <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b' }}>
                                                ₹{listing.price || '—'}
                                            </span>
                                            {listing.originalPrice && listing.originalPrice > listing.price && (
                                                <span style={{ fontSize: '0.9rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                                                    ₹{listing.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                        {listing.discount && listing.discount > 0 && (
                                            <motion.span
                                                animate={{ scale: [1, 1.05, 1] }}
                                                transition={{ repeat: Infinity, duration: 2.5 }}
                                                style={{
                                                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                                    color: 'white', padding: '3px 9px', borderRadius: '8px',
                                                    fontSize: '0.75rem', fontWeight: '800',
                                                    display: 'flex', alignItems: 'center', gap: '4px'
                                                }}>
                                                <FaTag size={9} /> {listing.discount}% OFF
                                            </motion.span>
                                        )}
                                    </div>
                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <motion.button
                                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                            onClick={ev => { ev.stopPropagation(); setOrderModal(listing); }}
                                            style={{
                                                padding: '9px 20px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                                color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800',
                                                cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center',
                                                gap: '6px', boxShadow: '0 4px 14px rgba(249,115,22,0.3)'
                                            }}>
                                            <FaShoppingCart size={12} /> Order Now
                                        </motion.button>
                                        <button
                                            onClick={ev => ev.stopPropagation()}
                                            style={{
                                                padding: '9px 14px', background: '#f3f4f6', color: '#374151',
                                                border: 'none', borderRadius: '10px', fontWeight: '600',
                                                cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px'
                                            }}>
                                            <FaMapMarkerAlt size={11} /> Directions
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                <AnimatePresence>
                                    {selectedListing?.id === listing.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            style={{ overflow: 'hidden', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                                {[
                                                    { icon: '📦', label: 'Storage', value: listing.storageType },
                                                    { icon: '🏠', label: 'Address', value: listing.address?.split(',')[0] },
                                                    { icon: '📞', label: 'Donor', value: listing.donorPhone },
                                                ].map((d, idx) => (
                                                    <div key={idx} style={{ background: '#f8fafc', borderRadius: '8px', padding: '8px', fontSize: '0.78rem' }}>
                                                        <div style={{ color: '#6b7280', marginBottom: '2px' }}>{d.icon} {d.label}</div>
                                                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.8rem' }}>{d.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* ===== MAP VIEW ===== */}
            {viewMode === 'map' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 280px)', minHeight: '520px' }}>

                    {/* Gamified Map */}
                    <div style={{
                        flex: 1, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                        borderRadius: '22px', position: 'relative', overflow: 'hidden',
                        border: '3px solid rgba(249,115,22,0.3)', boxShadow: '0 0 60px rgba(249,115,22,0.1)'
                    }}>
                        {/* Grid */}
                        <div style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: 'linear-gradient(rgba(249,115,22,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.05) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }} />

                        {/* Top label */}
                        <div style={{
                            position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.75)',
                            backdropFilter: 'blur(12px)', padding: '8px 18px', borderRadius: '22px', color: 'white',
                            fontSize: '0.82rem', fontWeight: '700', zIndex: 5, border: '1px solid rgba(249,115,22,0.4)'
                        }}>
                            🗺️ Chennai Live Food Map • {approvedListings.length} Active Donors
                        </div>

                        {/* You marker */}
                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2.2 }}
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 40px rgba(249,115,22,0.7)', color: 'white', fontSize: '1.6rem'
                            }}>
                                <FaUser />
                            </div>
                            <div style={{
                                textAlign: 'center', color: 'white', fontSize: '0.72rem', fontWeight: '800',
                                marginTop: '5px', background: 'rgba(0,0,0,0.7)', padding: '2px 10px', borderRadius: '12px'
                            }}>YOU</div>
                            {/* Pulse rings */}
                            {[1, 2, 3].map(r => (
                                <motion.div key={r} animate={{ scale: [1, 3.5], opacity: [0.6, 0] }}
                                    transition={{ repeat: Infinity, duration: 2.4, delay: r * 0.7 }}
                                    style={{
                                        position: 'absolute', top: '50%', left: '50%',
                                        transform: 'translate(-50%, -50%)', width: '64px', height: '64px',
                                        borderRadius: '50%', border: `2px solid ${r === 1 ? '#f97316' : r === 2 ? '#fb923c' : '#fdba74'}`,
                                        pointerEvents: 'none'
                                    }} />
                            ))}
                        </motion.div>

                        {/* Donor pin markers */}
                        {approvedListings.map((listing, i) => {
                            const angle = (i / approvedListings.length) * 2 * Math.PI + Math.PI / 5;
                            const maxRadius = 36;
                            const radius = Math.min(maxRadius, (listing.distance / 35) * maxRadius + 6);
                            const x = 50 + radius * Math.cos(angle);
                            const y = 50 + radius * Math.sin(angle);

                            return (
                                <motion.div key={listing.id} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                                    whileHover={{ scale: 1.25, zIndex: 20 }}
                                    onClick={() => setSelectedListing(selectedListing?.id === listing.id ? null : listing)}
                                    style={{
                                        position: 'absolute',
                                        top: `${Math.max(8, Math.min(86, y))}%`,
                                        left: `${Math.max(8, Math.min(86, x))}%`,
                                        transform: 'translate(-50%, -50%)',
                                        cursor: 'pointer', zIndex: 5
                                    }}>

                                    {/* Marker circle with real food image */}
                                    <div style={{
                                        width: '54px', height: '54px', borderRadius: '50%', overflow: 'hidden',
                                        border: `3px solid ${listing.isVeg ? '#22c55e' : '#ef4444'}`,
                                        boxShadow: `0 0 20px ${listing.isVeg ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)'}`,
                                        background: '#1e293b'
                                    }}>
                                        <img src={getImageSrc(listing)} alt={listing.food}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { e.target.src = getFoodImage(listing.food, listing.isVeg); }} />
                                    </div>
                                    <div style={{
                                        textAlign: 'center', color: 'white', fontSize: '0.62rem', fontWeight: '800',
                                        marginTop: '4px', background: 'rgba(0,0,0,0.8)', padding: '2px 7px', borderRadius: '9px',
                                        whiteSpace: 'nowrap', border: `1px solid ${listing.isVeg ? '#22c55e' : '#ef4444'}`
                                    }}>
                                        {listing.distance}km • ₹{listing.price || '?'}
                                    </div>

                                    {/* Popup */}
                                    {selectedListing?.id === listing.id && (
                                        <motion.div initial={{ opacity: 0, scale: 0.85, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                                            style={{
                                                position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
                                                background: 'white', borderRadius: '14px', padding: '14px',
                                                minWidth: '200px', boxShadow: '0 12px 40px rgba(0,0,0,0.35)', zIndex: 30
                                            }}>
                                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                <img src={getImageSrc(listing)} alt={listing.food}
                                                    style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                                                <div>
                                                    <h4 style={{ margin: '0 0 3px', fontSize: '0.9rem', fontWeight: '800' }}>{listing.food}</h4>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>{listing.donorName}</p>
                                                    <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#f97316', fontWeight: '700' }}>
                                                        {listing.distance}km • Serves {listing.serves}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <div>
                                                    <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#1e293b' }}>₹{listing.price || '—'}</span>
                                                    {listing.originalPrice && <span style={{ color: '#9ca3af', textDecoration: 'line-through', fontSize: '0.82rem', marginLeft: '6px' }}>₹{listing.originalPrice}</span>}
                                                </div>
                                                {listing.discount > 0 && (
                                                    <span style={{ background: '#22c55e', color: 'white', padding: '2px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '800' }}>
                                                        {listing.discount}% OFF
                                                    </span>
                                                )}
                                            </div>
                                            <button onClick={ev => { ev.stopPropagation(); setOrderModal(listing); }}
                                                style={{
                                                    width: '100%', padding: '8px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                                    color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '0.82rem'
                                                }}>
                                                Order Now
                                            </button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}

                        {/* Distance rings */}
                        {[10, 20, 35].map(km => (
                            <div key={km} style={{
                                position: 'absolute', top: '50%', left: '50%',
                                width: `${(km / 35) * 72}%`, height: `${(km / 35) * 72}%`,
                                transform: 'translate(-50%, -50%)', borderRadius: '50%',
                                border: '1px dashed rgba(249,115,22,0.25)', pointerEvents: 'none'
                            }}>
                                <span style={{ position: 'absolute', top: '0', right: '-20px', color: 'rgba(249,115,22,0.6)', fontSize: '0.62rem', fontWeight: '800' }}>{km}km</span>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div style={{ width: '290px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h3 style={{ fontWeight: '800', fontSize: '1rem', margin: '0 0 6px', color: '#1e293b' }}>
                            Nearby Donors <span style={{ color: '#6b7280', fontWeight: '500' }}>({approvedListings.length})</span>
                        </h3>
                        {approvedListings.map((listing, i) => (
                            <motion.div key={listing.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
                                onClick={() => setSelectedListing(listing)}
                                style={{
                                    background: selectedListing?.id === listing.id ? '#fff7ed' : 'white',
                                    borderRadius: '14px', padding: '12px',
                                    border: `2px solid ${selectedListing?.id === listing.id ? '#f97316' : '#e2e8f0'}`,
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    {/* Thumbnail */}
                                    <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: `2px solid ${listing.isVeg ? '#22c55e' : '#ef4444'}` }}>
                                        <img src={getImageSrc(listing)} alt={listing.food}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { e.target.src = getFoodImage(listing.food, listing.isVeg); }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: '800', fontSize: '0.875rem', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{listing.food}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{listing.donorName}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                                <span style={{ fontWeight: '900', fontSize: '0.95rem', color: '#1e293b' }}>₹{listing.price || '—'}</span>
                                                {listing.originalPrice && <span style={{ color: '#9ca3af', textDecoration: 'line-through', fontSize: '0.72rem' }}>₹{listing.originalPrice}</span>}
                                            </div>
                                            <span style={{ color: '#f97316', fontWeight: '800', fontSize: '0.82rem' }}>{listing.distance}km</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                                    <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Serves {listing.serves} people</span>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={ev => { ev.stopPropagation(); setOrderModal(listing); }}
                                        style={{
                                            padding: '5px 12px', background: '#f97316', color: 'white',
                                            border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '0.75rem'
                                        }}>
                                        Order
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ===== ORDER MODAL ===== */}
            <AnimatePresence>
                {orderModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
                            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', zIndex: 1000, padding: '20px'
                        }}>
                        <motion.div initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 30 }}
                            style={{
                                background: 'white', borderRadius: '24px', width: '100%',
                                maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
                                boxShadow: '0 24px 80px rgba(0,0,0,0.3)'
                            }}>
                            {orderSuccess ? (
                                <div style={{ textAlign: 'center', padding: '3rem' }}>
                                    <motion.div animate={{ scale: [0, 1.3, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 0.7 }}
                                        style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>✅</motion.div>
                                    <h3 style={{ fontWeight: '900', color: '#22c55e', marginBottom: '0.5rem', fontSize: '1.4rem' }}>Order Placed!</h3>
                                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>A delivery agent will be assigned shortly.</p>
                                    <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '12px 20px', display: 'inline-block', marginTop: '8px' }}>
                                        <span style={{ fontWeight: '700', color: '#166534', fontSize: '0.88rem' }}>
                                            ⏱️ Estimated delivery: 30-45 minutes
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Food image hero */}
                                    <div style={{ position: 'relative', height: '160px', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
                                        <img src={getImageSrc(orderModal)} alt={orderModal.food}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
                                        <button onClick={() => setOrderModal(null)}
                                            style={{
                                                position: 'absolute', top: '12px', right: '12px',
                                                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                                                border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                            }}>
                                            <FaTimes />
                                        </button>
                                        <div style={{ position: 'absolute', bottom: '14px', left: '16px', color: 'white' }}>
                                            <div style={{ fontWeight: '900', fontSize: '1.3rem' }}>{orderModal.food}</div>
                                            <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>{orderModal.donorName}</div>
                                        </div>
                                    </div>

                                    <div style={{ padding: '1.5rem' }}>
                                        {/* Food Info Card */}
                                        <div style={{
                                            background: '#fff7ed', border: '1px solid #fed7aa',
                                            borderRadius: '14px', padding: '1rem', marginBottom: '1.5rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                    <span style={{ fontWeight: '900', fontSize: '1.6rem', color: '#1e293b' }}>₹{orderModal.price || '—'}</span>
                                                    {orderModal.originalPrice && orderModal.originalPrice > orderModal.price && (
                                                        <span style={{ color: '#9ca3af', textDecoration: 'line-through', fontSize: '1rem' }}>₹{orderModal.originalPrice}</span>
                                                    )}
                                                </div>
                                                {orderModal.discount > 0 && (
                                                    <div style={{
                                                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                                        color: 'white', padding: '5px 12px', borderRadius: '10px',
                                                        fontWeight: '900', fontSize: '0.85rem',
                                                        display: 'flex', alignItems: 'center', gap: '4px'
                                                    }}>
                                                        <FaBolt size={10} /> {orderModal.discount}% OFF
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                                {[
                                                    { icon: '📍', label: `${orderModal.distance || '—'}km away` },
                                                    { icon: '👥', label: `Serves ${orderModal.serves}` },
                                                    { icon: '⚖️', label: `${orderModal.weight}g` },
                                                ].map((d, i) => (
                                                    <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '6px 10px', fontSize: '0.75rem', fontWeight: '600', color: '#374151', textAlign: 'center' }}>
                                                        {d.icon} {d.label}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* AI Safety badge */}
                                            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    background: `${getAiScoreColor(orderModal.aiScore)}15`,
                                                    borderRadius: '8px', padding: '6px 12px',
                                                    border: `1px solid ${getAiScoreColor(orderModal.aiScore)}40`
                                                }}>
                                                    <FaCheckCircle color={getAiScoreColor(orderModal.aiScore)} size={13} />
                                                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: getAiScoreColor(orderModal.aiScore) }}>
                                                        AI Safety: {orderModal.aiScore}/100 — {getAiScoreLabel(orderModal.aiScore)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {[
                                                { label: 'Your Name', key: 'name', type: 'text', placeholder: 'Enter your full name' },
                                                { label: 'Contact Number', key: 'phone', type: 'tel', placeholder: '9XXXXXXXXX' },
                                            ].map(f => (
                                                <div key={f.key}>
                                                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem', color: '#374151' }}>{f.label} *</label>
                                                    <input type={f.type} placeholder={f.placeholder} required value={orderForm[f.key]}
                                                        onChange={e => setOrderForm(p => ({ ...p, [f.key]: e.target.value }))}
                                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
                                                </div>
                                            ))}
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem', color: '#374151' }}>Delivery Address *</label>
                                                <textarea placeholder="Enter your full delivery address" required value={orderForm.address}
                                                    onChange={e => setOrderForm(p => ({ ...p, address: e.target.value }))} rows={2}
                                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.95rem', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' }} />
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem', color: '#374151' }}>Quantity (Servings) *</label>
                                                <input type="number" min="1" max={orderModal.serves} value={orderForm.quantity}
                                                    onChange={e => setOrderForm(p => ({ ...p, quantity: e.target.value }))} required
                                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
                                            </div>

                                            {/* Order Summary */}
                                            {orderModal.price && (
                                                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Price × {orderForm.quantity} serving(s)</span>
                                                        <span style={{ fontWeight: '700' }}>₹{orderModal.price * orderForm.quantity}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Delivery fee</span>
                                                        <span style={{ fontWeight: '700', color: '#22c55e' }}>FREE</span>
                                                    </div>
                                                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontWeight: '800', fontSize: '1rem' }}>Total</span>
                                                        <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#f97316' }}>₹{orderModal.price * orderForm.quantity}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <motion.button type="submit" whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(249,115,22,0.5)' }} whileTap={{ scale: 0.98 }}
                                                style={{
                                                    padding: '15px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                                    color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900',
                                                    cursor: 'pointer', fontSize: '1.05rem', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', gap: '10px', boxShadow: '0 6px 20px rgba(249,115,22,0.4)'
                                                }}>
                                                <FaShoppingCart /> Place Order
                                            </motion.button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReceiverMap;
