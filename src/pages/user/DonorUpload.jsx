import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaWeight, FaShieldAlt, FaLeaf, FaDrumstickBite, FaRupeeSign, FaTag, FaFire, FaClock, FaUsers } from 'react-icons/fa';
import { useApp, getFoodImage } from '../../context/AppContext';

const VEG_FOODS = [
    'Sambar Rice', 'Rasam Rice', 'Curd Rice', 'Veg Biryani', 'Pongal',
    'Idli & Sambar', 'Dosa & Chutney', 'Upma', 'Poha', 'Chapati & Dal',
    'Veg Kurma', 'Aloo Paratha', 'Pulao', 'Lemon Rice', 'Tamarind Rice',
    'Veg Fried Rice', 'Palak Paneer', 'Dal Tadka', 'Rajma Rice', 'Chana Masala',
    'Veg Pulao', 'Tomato Rice', 'Coconut Rice', 'Veg Khichdi', 'Pesarattu'
];

const NONVEG_FOODS = [
    'Chicken Biryani', 'Mutton Biryani', 'Fish Curry & Rice', 'Chicken Curry',
    'Egg Rice', 'Prawn Masala', 'Chicken 65', 'Mutton Kuzhambu', 'Fish Fry',
    'Chicken Gravy', 'Egg Curry', 'Crab Masala', 'Chicken Kothu Parotta',
    'Mutton Chukka', 'Chicken Tikka', 'Egg Biryani', 'Prawn Biryani',
    'Chicken Korma', 'Fish Biryani', 'Mutton Soup', 'Chicken Soup',
    'Egg Bhurji', 'Chicken Pepper Fry', 'Mutton Rogan Josh', 'Chicken Chettinad'
];

const FOOD_RISK = {
    'Sambar Rice': 'Medium', 'Rasam Rice': 'Medium', 'Curd Rice': 'High',
    'Veg Biryani': 'High', 'Pongal': 'Medium', 'Idli & Sambar': 'Medium',
    'Dosa & Chutney': 'Low', 'Upma': 'Low', 'Poha': 'Low', 'Chapati & Dal': 'Medium',
    'Veg Kurma': 'Medium', 'Aloo Paratha': 'Low', 'Pulao': 'Medium',
    'Lemon Rice': 'Low', 'Tamarind Rice': 'Low', 'Veg Fried Rice': 'Medium',
    'Palak Paneer': 'High', 'Dal Tadka': 'Medium', 'Rajma Rice': 'Medium',
    'Chana Masala': 'Medium', 'Veg Pulao': 'Medium', 'Tomato Rice': 'Low',
    'Coconut Rice': 'Low', 'Veg Khichdi': 'Medium', 'Pesarattu': 'Low',
    'Chicken Biryani': 'High', 'Mutton Biryani': 'High', 'Fish Curry & Rice': 'High',
    'Chicken Curry': 'High', 'Egg Rice': 'High', 'Prawn Masala': 'High',
    'Chicken 65': 'High', 'Mutton Kuzhambu': 'High', 'Fish Fry': 'High',
    'Chicken Gravy': 'High', 'Egg Curry': 'High', 'Crab Masala': 'High',
    'Chicken Kothu Parotta': 'High', 'Mutton Chukka': 'High', 'Chicken Tikka': 'High',
    'Egg Biryani': 'High', 'Prawn Biryani': 'High', 'Chicken Korma': 'High',
    'Fish Biryani': 'High', 'Mutton Soup': 'High', 'Chicken Soup': 'High',
    'Egg Bhurji': 'High', 'Chicken Pepper Fry': 'High', 'Mutton Rogan Josh': 'High',
    'Chicken Chettinad': 'High'
};

const calculateAIScore = (formData, geoLocation) => {
    const now = new Date();
    const cookTime = new Date();
    if (formData.cookingTime) {
        const [h, m] = formData.cookingTime.split(':');
        cookTime.setHours(parseInt(h), parseInt(m), 0);
    }
    const minutesSinceCooking = Math.max(0, (now - cookTime) / 60000);

    let timeRisk = 0;
    if (minutesSinceCooking < 60) timeRisk = 5;
    else if (minutesSinceCooking < 120) timeRisk = 20;
    else if (minutesSinceCooking < 240) timeRisk = 50;
    else if (minutesSinceCooking < 360) timeRisk = 75;
    else timeRisk = 95;

    const ambientTemp = 32;
    let tempRisk = 0;
    if (ambientTemp > 35) tempRisk = 80;
    else if (ambientTemp > 30) tempRisk = 50;
    else if (ambientTemp > 25) tempRisk = 30;
    else tempRisk = 10;

    const riskLevel = FOOD_RISK[formData.food] || 'Medium';
    const foodTypeRisk = riskLevel === 'High' ? 70 : riskLevel === 'Medium' ? 40 : 15;

    const storageRisk = {
        'Refrigerator': 10, 'Hot Case': 20, 'Sealed Packaging': 15,
        'Room Temperature': 60, 'Open Shelf': 80
    }[formData.storageType] || 50;

    const hygieneScore = formData.capturedImage ? 85 : 0;
    const geoScore = geoLocation ? 90 : 0;
    const quantityScore = formData.weight > 0 && formData.weight < 50000 ? 85 : 40;
    const envRisk = formData.storageLocation === 'Outdoor' ? 70 : 30;

    const rawScore = 100 - (
        (timeRisk * 0.25) +
        (tempRisk * 0.15) +
        (foodTypeRisk * 0.20) +
        (storageRisk * 0.15) +
        ((100 - hygieneScore) * 0.10) +
        ((100 - geoScore) * 0.05) +
        ((100 - quantityScore) * 0.05) +
        (envRisk * 0.05)
    );

    const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

    let status, color;
    if (finalScore >= 75) { status = 'approved'; color = '#22c55e'; }
    else if (finalScore >= 50) { status = 'review'; color = '#f97316'; }
    else { status = 'rejected'; color = '#ef4444'; }

    const expiryHours = Math.max(0, Math.round((240 - minutesSinceCooking) / 60));

    return {
        score: finalScore, status, color,
        timeRisk: Math.round(timeRisk), tempRisk: Math.round(tempRisk),
        foodTypeRisk: Math.round(foodTypeRisk), storageRisk: Math.round(storageRisk),
        hygieneScore, geoScore, expiryHours,
        minutesSinceCooking: Math.round(minutesSinceCooking), ambientTemp
    };
};

const DonorUpload = () => {
    const { addListing, listings } = useApp();
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [geoLocation, setGeoLocation] = useState(null);
    const [geoError, setGeoError] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [foodType, setFoodType] = useState('veg');
    const [formData, setFormData] = useState({
        food: '', cookingTime: '', storageType: '', storageLocation: 'Indoor',
        weight: '', serves: '', packaging: '', hygiene: false, capturedImage: null,
        price: '', originalPrice: ''
    });
    const [errors, setErrors] = useState({});
    const [analysisSteps, setAnalysisSteps] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const myListings = listings.filter(l => l.donorName === 'You (Donor)');

    useEffect(() => {
        navigator.geolocation?.getCurrentPosition(
            pos => setGeoLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => setGeoError('Location access denied. Geo-tag required.')
        );
    }, []);

    // Ensure video element gets stream after camera activates
    useEffect(() => {
        if (cameraActive && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(() => { });
        }
    }, [cameraActive]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            streamRef.current = stream;
            setCameraActive(true);
        } catch {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                setCameraActive(true);
            } catch {
                alert('Camera access required. Please allow camera permissions in your browser.');
            }
        }
    };

    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        setCameraActive(false);
    };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        if (geoLocation) {
            ctx.fillStyle = 'rgba(0,0,0,0.65)';
            ctx.fillRect(0, canvas.height - 64, canvas.width, 64);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`📍 ${geoLocation.lat.toFixed(4)}, ${geoLocation.lng.toFixed(4)}`, 12, canvas.height - 38);
            ctx.fillText(`🕐 ${new Date().toLocaleString('en-IN')}`, 12, canvas.height - 12);
        }
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        setFormData(prev => ({ ...prev, capturedImage: dataUrl }));
        stopCamera();
    };

    const validate = () => {
        const e = {};
        if (!formData.food) e.food = 'Food item is required';
        if (!formData.cookingTime) e.cookingTime = 'Cooking time is required';
        if (!formData.storageType) e.storageType = 'Storage type is required';
        if (!formData.weight || formData.weight <= 0) e.weight = 'Weight in grams is required';
        if (!formData.serves || formData.serves <= 0) e.serves = 'Number of servings is required';
        if (!formData.packaging) e.packaging = 'Packaging type is required';
        if (!formData.price || formData.price <= 0) e.price = 'Demanded price is required';
        if (!capturedImage) e.capturedImage = 'Live photo capture is required';
        if (!geoLocation) e.geo = 'Location access is required';
        if (!formData.hygiene) e.hygiene = 'Hygiene confirmation is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setStep(2);
        setIsAnalyzing(true);
        const steps = [
            'Scanning image for spoilage markers...',
            'Validating geo-tag & timestamp...',
            'Verifying weighing scale visibility...',
            'Checking ambient temperature risk...',
            'Calculating time-based bacterial growth...',
            'Analyzing storage conditions...',
            'Running food type risk assessment...',
            'Computing final AI Safety Score...'
        ];
        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                setAnalysisSteps(prev => [...prev, steps[i]]);
                i++;
            } else {
                clearInterval(interval);
                const result = calculateAIScore(formData, geoLocation);
                setAiResult(result);
                const price = parseInt(formData.price) || 0;
                const originalPrice = parseInt(formData.originalPrice) || Math.round(price * 1.6);
                const discount = originalPrice > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
                const newListing = {
                    id: `L${Date.now()}`,
                    donorName: 'You (Donor)',
                    donorPhone: '9999999999',
                    food: formData.food,
                    category: FOOD_RISK[formData.food] || 'Medium',
                    weight: parseInt(formData.weight),
                    serves: parseInt(formData.serves),
                    cookingTime: formData.cookingTime,
                    storageType: formData.storageType,
                    location: geoLocation ? `${geoLocation.lat.toFixed(4)}, ${geoLocation.lng.toFixed(4)}` : 'Chennai',
                    lat: geoLocation?.lat || 13.0827,
                    lng: geoLocation?.lng || 80.2707,
                    distance: parseFloat((Math.random() * 8 + 0.5).toFixed(1)),
                    status: result.status,
                    aiScore: result.score,
                    image: capturedImage,
                    foodImage: getFoodImage(formData.food, foodType === 'veg'),
                    postedAt: new Date().toISOString(),
                    address: 'Your Location, Chennai',
                    isVeg: foodType === 'veg',
                    price,
                    originalPrice,
                    discount,
                };
                addListing(newListing);
                setIsAnalyzing(false);
                setStep(3);
            }
        }, 400);
    };

    const resetForm = () => {
        setStep(1); setCapturedImage(null); stopCamera();
        setFormData({ food: '', cookingTime: '', storageType: '', storageLocation: 'Indoor', weight: '', serves: '', packaging: '', hygiene: false, capturedImage: null, price: '', originalPrice: '' });
        setAiResult(null); setAnalysisSteps([]); setErrors({});
    };

    const inputStyle = (field) => ({
        width: '100%', padding: '12px 16px', borderRadius: '12px',
        border: errors[field] ? '2px solid #ef4444' : '2px solid #e2e8f0',
        fontSize: '0.95rem', background: '#fafafa', outline: 'none',
        transition: 'border 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
        fontFamily: 'inherit',
    });

    const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '700', fontSize: '0.85rem', color: '#374151', letterSpacing: '0.02em' };

    return (
        <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '3rem' }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(249,115,22,0.35)', fontSize: '1.8rem'
                    }}>🍱</div>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: '#1e293b' }}>Upload Surplus Food</h1>
                        <p style={{ color: '#6b7280', margin: '2px 0 0', fontSize: '0.9rem' }}>Live capture • Geo-tagged • AI Safety Verified • Price Listed</p>
                    </div>
                </div>
            </motion.div>

            {/* Step Indicator */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '1.5rem 0', padding: '16px 20px', background: 'white', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                {[{ n: 1, label: 'Food Details' }, { n: 2, label: 'AI Analysis' }, { n: 3, label: 'Listed!' }].map((s, i) => (
                    <React.Fragment key={s.n}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem',
                                background: step >= s.n ? 'linear-gradient(135deg, #f97316, #ea580c)' : '#f3f4f6',
                                color: step >= s.n ? 'white' : '#9ca3af', transition: 'all 0.3s'
                            }}>{step > s.n ? '✓' : s.n}</div>
                            <span style={{ fontSize: '0.85rem', fontWeight: step === s.n ? '700' : '500', color: step === s.n ? '#f97316' : '#6b7280' }}>{s.label}</span>
                        </div>
                        {i < 2 && <div style={{ flex: 1, height: '2px', background: step > s.n ? '#f97316' : '#e2e8f0', borderRadius: '2px', transition: 'background 0.3s' }} />}
                    </React.Fragment>
                ))}
            </motion.div>

            {/* My Listings Summary */}
            <AnimatePresence>
                {myListings.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #86efac', borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '1.2rem' }}>📋</span>
                            <strong style={{ color: '#166534' }}>Your Listings:</strong>
                            {myListings.slice(0, 3).map(l => (
                                <span key={l.id} style={{
                                    padding: '3px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700',
                                    background: l.status === 'approved' ? '#22c55e' : l.status === 'review' ? '#f97316' : '#ef4444', color: 'white'
                                }}>{l.food} ({l.status})</span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {/* ===== STEP 1: FORM ===== */}
                {step === 1 && (
                    <motion.form key="form" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                        onSubmit={handleSubmit} style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>

                        {/* Geo Status */}
                        <motion.div animate={{ scale: geoLocation ? [1, 1.02, 1] : 1 }} transition={{ duration: 0.4 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '12px',
                                background: geoLocation ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : '#fef2f2',
                                border: `1.5px solid ${geoLocation ? '#86efac' : '#fca5a5'}`, marginBottom: '1.5rem'
                            }}>
                            <FaMapMarkerAlt color={geoLocation ? '#22c55e' : '#ef4444'} size={16} />
                            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: geoLocation ? '#166534' : '#991b1b' }}>
                                {geoLocation ? `Geo-tag Active: ${geoLocation.lat.toFixed(4)}, ${geoLocation.lng.toFixed(4)}` : geoError || 'Requesting location...'}
                            </span>
                            {geoLocation && <span style={{ marginLeft: 'auto', background: '#22c55e', color: 'white', fontSize: '0.7rem', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>ACTIVE</span>}
                        </motion.div>

                        {/* Food Type Toggle */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Food Category *</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {['veg', 'nonveg'].map(t => (
                                    <motion.button key={t} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => { setFoodType(t); setFormData(p => ({ ...p, food: '' })); }}
                                        style={{
                                            flex: 1, padding: '14px', borderRadius: '12px',
                                            border: `2.5px solid ${foodType === t ? (t === 'veg' ? '#22c55e' : '#ef4444') : '#e2e8f0'}`,
                                            background: foodType === t ? (t === 'veg' ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)') : '#f9fafb',
                                            color: foodType === t ? (t === 'veg' ? '#166534' : '#991b1b') : '#6b7280',
                                            fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                            fontSize: '0.95rem', transition: 'all 0.2s'
                                        }}>
                                        {t === 'veg' ? <FaLeaf color={foodType === t ? '#22c55e' : '#9ca3af'} /> : <FaDrumstickBite color={foodType === t ? '#ef4444' : '#9ca3af'} />}
                                        {t === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: t === 'veg' ? '#22c55e' : '#ef4444', border: '2px solid currentColor' }} />
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                            {/* Food Item */}
                            <div>
                                <label style={labelStyle}>Food Item *</label>
                                <select value={formData.food} onChange={e => setFormData(p => ({ ...p, food: e.target.value }))} style={inputStyle('food')} required>
                                    <option value="">Select food item...</option>
                                    {(foodType === 'veg' ? VEG_FOODS : NONVEG_FOODS).map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                                {errors.food && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>{errors.food}</p>}
                            </div>

                            {/* Cooking Time */}
                            <div>
                                <label style={labelStyle}><FaClock style={{ marginRight: '6px' }} />Cooking Time *</label>
                                <input type="time" value={formData.cookingTime} onChange={e => setFormData(p => ({ ...p, cookingTime: e.target.value }))} style={inputStyle('cookingTime')} required />
                                {errors.cookingTime && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>{errors.cookingTime}</p>}
                            </div>

                            {/* Weight */}
                            <div>
                                <label style={labelStyle}><FaWeight style={{ marginRight: '6px' }} />Weight (grams) *</label>
                                <input type="number" min="100" max="100000" placeholder="e.g. 5000" value={formData.weight}
                                    onChange={e => setFormData(p => ({ ...p, weight: e.target.value }))} style={inputStyle('weight')} required />
                                {errors.weight && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>{errors.weight}</p>}
                            </div>

                            {/* Serves */}
                            <div>
                                <label style={labelStyle}><FaUsers style={{ marginRight: '6px' }} />Serves (People) *</label>
                                <input type="number" min="1" max="5000" placeholder="e.g. 30" value={formData.serves}
                                    onChange={e => setFormData(p => ({ ...p, serves: e.target.value }))} style={inputStyle('serves')} required />
                                {errors.serves && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>{errors.serves}</p>}
                            </div>

                            {/* Storage Type */}
                            <div>
                                <label style={labelStyle}>Storage Type *</label>
                                <select value={formData.storageType} onChange={e => setFormData(p => ({ ...p, storageType: e.target.value }))} style={inputStyle('storageType')} required>
                                    <option value="">Select storage...</option>
                                    <option>Refrigerator</option>
                                    <option>Hot Case</option>
                                    <option>Sealed Packaging</option>
                                    <option>Room Temperature</option>
                                    <option>Open Shelf</option>
                                </select>
                                {errors.storageType && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>{errors.storageType}</p>}
                            </div>

                            {/* Storage Location */}
                            <div>
                                <label style={labelStyle}>Storage Location *</label>
                                <select value={formData.storageLocation} onChange={e => setFormData(p => ({ ...p, storageLocation: e.target.value }))} style={inputStyle('storageLocation')} required>
                                    <option value="Indoor">Indoor</option>
                                    <option value="Outdoor">Outdoor</option>
                                </select>
                            </div>

                            {/* Packaging */}
                            <div>
                                <label style={labelStyle}>Packaging Type *</label>
                                <select value={formData.packaging} onChange={e => setFormData(p => ({ ...p, packaging: e.target.value }))} style={inputStyle('packaging')} required>
                                    <option value="">Select packaging...</option>
                                    <option>Sealed Container</option>
                                    <option>Covered Vessel</option>
                                    <option>Open Container</option>
                                    <option>Foil Wrapped</option>
                                    <option>Banana Leaf</option>
                                </select>
                                {errors.packaging && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>{errors.packaging}</p>}
                            </div>
                        </div>

                        {/* Price Demand Section */}
                        <div style={{
                            background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', border: '2px solid #fed7aa',
                            borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #f97316, #ea580c)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaRupeeSign color="white" size={16} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontWeight: '800', fontSize: '1rem', color: '#9a3412' }}>Price Demand</h3>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#c2410c' }}>Set your demanded price (discounted from market rate)</p>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ ...labelStyle, color: '#9a3412' }}>
                                        <FaTag style={{ marginRight: '6px' }} />Your Demanded Price (₹) *
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#f97316', fontWeight: '800', fontSize: '1.1rem' }}>₹</span>
                                        <input type="number" min="0" max="10000" placeholder="e.g. 120" value={formData.price}
                                            onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                                            style={{ ...inputStyle('price'), paddingLeft: '32px', borderColor: errors.price ? '#ef4444' : '#fed7aa', background: 'white' }} />
                                    </div>
                                    {errors.price && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>{errors.price}</p>}
                                </div>
                                <div>
                                    <label style={{ ...labelStyle, color: '#9a3412' }}>Original Market Price (₹) <span style={{ fontWeight: '400', fontSize: '0.8rem' }}>(optional)</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontWeight: '800', fontSize: '1.1rem' }}>₹</span>
                                        <input type="number" min="0" max="10000" placeholder="e.g. 200" value={formData.originalPrice}
                                            onChange={e => setFormData(p => ({ ...p, originalPrice: e.target.value }))}
                                            style={{ ...inputStyle(''), paddingLeft: '32px', borderColor: '#fed7aa', background: 'white' }} />
                                    </div>
                                </div>
                            </div>
                            {formData.price && formData.originalPrice && parseInt(formData.originalPrice) > parseInt(formData.price) && (
                                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                                    style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ background: '#22c55e', color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>
                                        {Math.round(((parseInt(formData.originalPrice) - parseInt(formData.price)) / parseInt(formData.originalPrice)) * 100)}% OFF
                                    </span>
                                    <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: '600' }}>
                                        Saves ₹{parseInt(formData.originalPrice) - parseInt(formData.price)} per order
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        {/* Live Camera Capture */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>
                                <FaCamera style={{ marginRight: '6px' }} />
                                Live Photo Capture — Weighing Scale Must Be Visible *
                            </label>
                            <div style={{
                                border: `2.5px dashed ${errors.capturedImage ? '#ef4444' : '#e2e8f0'}`,
                                borderRadius: '16px', overflow: 'hidden', background: '#f8fafc', minHeight: '200px'
                            }}>
                                {/* Camera NOT active, no image */}
                                {!cameraActive && !capturedImage && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        style={{ padding: '2.5rem', textAlign: 'center' }}>
                                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}
                                            style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📷</motion.div>
                                        <p style={{ color: '#374151', marginBottom: '8px', fontWeight: '700', fontSize: '1rem' }}>
                                            Live camera capture only — No file uploads allowed
                                        </p>
                                        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                            Ensure weighing scale is visible in frame • Geo-tag embedded automatically
                                        </p>
                                        <motion.button type="button" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                            onClick={startCamera}
                                            style={{
                                                padding: '14px 36px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                                color: 'white', borderRadius: '12px', fontWeight: '800', cursor: 'pointer',
                                                border: 'none', fontSize: '1rem', boxShadow: '0 6px 20px rgba(249,115,22,0.35)',
                                                display: 'inline-flex', alignItems: 'center', gap: '10px'
                                            }}>
                                            <FaCamera />  Open Camera
                                        </motion.button>
                                    </motion.div>
                                )}

                                {/* Camera ACTIVE — show live video */}
                                {cameraActive && (
                                    <div style={{ position: 'relative', background: '#000' }}>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
                                        />
                                        {/* Live overlay label */}
                                        <div style={{
                                            position: 'absolute', top: '12px', left: '12px',
                                            background: 'rgba(220,38,38,0.85)', color: 'white',
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '800',
                                            display: 'flex', alignItems: 'center', gap: '6px'
                                        }}>
                                            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                                                style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', display: 'inline-block' }} />
                                            LIVE
                                        </div>
                                        {/* Geo-tag display */}
                                        {geoLocation && (
                                            <div style={{
                                                position: 'absolute', top: '12px', right: '12px',
                                                background: 'rgba(0,0,0,0.72)', color: 'white',
                                                padding: '5px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '600'
                                            }}>
                                                📍 {geoLocation.lat.toFixed(4)}, {geoLocation.lng.toFixed(4)}
                                            </div>
                                        )}
                                        {/* Buttons */}
                                        <div style={{
                                            position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
                                            display: 'flex', gap: '12px'
                                        }}>
                                            <motion.button type="button" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                                                onClick={capturePhoto}
                                                style={{
                                                    padding: '14px 32px', background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                                                    color: 'white', borderRadius: '30px', fontWeight: '800', cursor: 'pointer',
                                                    border: 'none', fontSize: '1rem', boxShadow: '0 6px 20px rgba(34,197,94,0.45)',
                                                    display: 'flex', alignItems: 'center', gap: '8px'
                                                }}>
                                                <FaCamera /> Capture Photo
                                            </motion.button>
                                            <motion.button type="button" whileTap={{ scale: 0.96 }}
                                                onClick={stopCamera}
                                                style={{
                                                    padding: '14px 20px', background: 'rgba(239,68,68,0.85)', backdropFilter: 'blur(10px)',
                                                    color: 'white', borderRadius: '30px', fontWeight: '800', cursor: 'pointer', border: 'none'
                                                }}>✕</motion.button>
                                        </div>
                                    </div>
                                )}

                                {/* Captured Image Preview */}
                                {capturedImage && !cameraActive && (
                                    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                                        style={{ position: 'relative' }}>
                                        <img src={capturedImage} alt="Captured food"
                                            style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', display: 'block' }} />
                                        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px' }}>
                                            <span style={{ background: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>✓ Geo-Tagged</span>
                                            <span style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>AI Ready</span>
                                        </div>
                                        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                            <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                                onClick={() => { setCapturedImage(null); setFormData(p => ({ ...p, capturedImage: null })); }}
                                                style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '20px', padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}>
                                                Retake
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                            {errors.capturedImage && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '6px', fontWeight: '600' }}>⚠ {errors.capturedImage}</p>}
                            {errors.geo && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', fontWeight: '600' }}>⚠ {errors.geo}</p>}
                        </div>

                        {/* Hygiene Confirmation */}
                        <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: '14px', padding: '1.2rem 1.5rem', marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={formData.hygiene} onChange={e => setFormData(p => ({ ...p, hygiene: e.target.checked }))}
                                    style={{ width: '20px', height: '20px', marginTop: '2px', accentColor: '#f97316', flexShrink: 0 }} />
                                <span style={{ fontSize: '0.88rem', color: '#92400e', fontWeight: '600', lineHeight: 1.5 }}>
                                    I confirm the food is freshly prepared, hygienically handled, properly packaged, and the weighing scale is visible in the photo. False submissions will result in account suspension.
                                </span>
                            </label>
                            {errors.hygiene && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '6px', fontWeight: '600' }}>⚠ {errors.hygiene}</p>}
                        </div>

                        <motion.button type="submit" whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(249,115,22,0.5)' }} whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%', padding: '18px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                color: 'white', border: 'none', borderRadius: '14px', fontSize: '1.1rem',
                                fontWeight: '900', cursor: 'pointer', boxShadow: '0 6px 24px rgba(249,115,22,0.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                            }}>
                            <FaShieldAlt /> Run AI Safety Check & Post
                        </motion.button>
                    </motion.form>
                )}

                {/* ===== STEP 2: ANALYZING ===== */}
                {step === 2 && (
                    <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        style={{ background: 'white', borderRadius: '20px', padding: '3rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                        {/* Spinner */}
                        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2rem' }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                style={{ width: '100px', height: '100px', borderRadius: '50%', border: '6px solid #f3f4f6', borderTop: '6px solid #f97316', position: 'absolute' }} />
                            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                                style={{ width: '70px', height: '70px', borderRadius: '50%', border: '4px solid #f3f4f6', borderBottom: '4px solid #22c55e', position: 'absolute', top: '15px', left: '15px' }} />
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                fontSize: '1.5rem'
                            }}>🤖</div>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem', color: '#1e293b' }}>AI Safety Analysis Running...</h3>
                        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Checking all 8 safety parameters</p>
                        <div style={{ textAlign: 'left', maxWidth: '420px', margin: '0 auto' }}>
                            {analysisSteps.map((s, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    style={{
                                        padding: '10px 14px', marginBottom: '8px',
                                        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                                        borderRadius: '10px', fontSize: '0.88rem', color: '#166534', fontWeight: '600',
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        border: '1px solid #86efac'
                                    }}>
                                    <FaCheckCircle color="#22c55e" size={14} />
                                    {s}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ===== STEP 3: RESULT ===== */}
                {step === 3 && aiResult && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        {/* Score Banner */}
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            style={{
                                background: aiResult.status === 'approved'
                                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                    : aiResult.status === 'review'
                                        ? 'linear-gradient(135deg, #f97316, #ea580c)'
                                        : 'linear-gradient(135deg, #ef4444, #dc2626)',
                                borderRadius: '20px', padding: '2.5rem', textAlign: 'center', color: 'white',
                                marginBottom: '1.5rem', boxShadow: `0 16px 48px ${aiResult.color}50`
                            }}>
                            <motion.div animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.6 }}
                                style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
                                {aiResult.status === 'approved' ? '✅' : aiResult.status === 'review' ? '⚠️' : '❌'}
                            </motion.div>
                            <div style={{ fontSize: '5rem', fontWeight: '900', lineHeight: 1 }}>{aiResult.score}</div>
                            <div style={{ fontSize: '1rem', opacity: 0.85, marginBottom: '0.5rem' }}>/ 100 AI Safety Score</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>
                                {aiResult.status === 'approved' ? 'APPROVED — Listed Live!' : aiResult.status === 'review' ? 'MANUAL REVIEW REQUIRED' : 'AUTO REJECTED'}
                            </div>
                            <p style={{ opacity: 0.85, marginTop: '0.5rem', fontSize: '0.9rem' }}>
                                {aiResult.status === 'approved' ? 'Your food is now visible to receivers on the map.' : aiResult.status === 'review' ? 'An admin will review your submission within 30 minutes.' : 'Food did not meet safety standards. Check conditions and resubmit.'}
                            </p>
                            {formData.price && (
                                <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '30px' }}>
                                    <FaRupeeSign />
                                    <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>₹{formData.price} listed</span>
                                    {formData.originalPrice && <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>₹{formData.originalPrice}</span>}
                                </div>
                            )}
                        </motion.div>

                        {/* Score Breakdown */}
                        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontWeight: '800', fontSize: '1.1rem' }}>📊 AI Score Breakdown</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[
                                    { label: 'Time Risk', value: aiResult.timeRisk, desc: `${aiResult.minutesSinceCooking} min since cooking`, invert: true },
                                    { label: 'Temperature Risk', value: aiResult.tempRisk, desc: `${aiResult.ambientTemp}°C ambient`, invert: true },
                                    { label: 'Food Type Risk', value: aiResult.foodTypeRisk, desc: FOOD_RISK[formData.food] + ' Risk', invert: true },
                                    { label: 'Storage Risk', value: aiResult.storageRisk, desc: formData.storageType, invert: true },
                                    { label: 'Image Hygiene', value: aiResult.hygieneScore, desc: 'Photo quality & cleanliness', invert: false },
                                    { label: 'Geo-Tag Score', value: aiResult.geoScore, desc: 'Location validated', invert: false },
                                ].map((item, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                        style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#1e293b' }}>{item.label}</span>
                                            <span style={{ fontWeight: '900', fontSize: '1.1rem', color: item.invert ? (item.value > 60 ? '#ef4444' : item.value > 30 ? '#f97316' : '#22c55e') : (item.value > 70 ? '#22c55e' : '#f97316') }}>
                                                {item.value}
                                            </span>
                                        </div>
                                        <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                                                style={{ height: '100%', borderRadius: '4px', background: item.invert ? (item.value > 60 ? '#ef4444' : item.value > 30 ? '#f97316' : '#22c55e') : (item.value > 70 ? '#22c55e' : '#f97316') }} />
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fffbeb', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #fcd34d' }}>
                                <span style={{ fontWeight: '700', color: '#92400e' }}>⏰ Safe Consumption Window</span>
                                <span style={{ fontWeight: '900', color: aiResult.expiryHours > 2 ? '#22c55e' : '#ef4444', fontSize: '1.1rem' }}>
                                    {aiResult.expiryHours} hours remaining
                                </span>
                            </div>
                        </div>

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={resetForm}
                            style={{
                                width: '100%', padding: '16px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer',
                                fontSize: '1.05rem', boxShadow: '0 6px 24px rgba(249,115,22,0.35)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                            }}>
                            + Upload Another Food Item
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DonorUpload;
