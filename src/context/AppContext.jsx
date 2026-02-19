import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

// Real food image URLs (Unsplash/food photo APIs)
const FOOD_IMAGES = {
    'Veg Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
    'Chicken Biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80',
    'Mutton Biryani': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&q=80',
    'Idli & Sambar': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80',
    'Dosa & Chutney': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80',
    'Chicken Curry': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80',
    'Sambar Rice': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    'Curd Rice': 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&q=80',
    'Bread & Buns': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
    'Mutton Kuzhambu': 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&q=80',
    'Fish Curry & Rice': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&q=80',
    'Pongal': 'https://images.unsplash.com/photo-1645177628172-a788e8994a79?w=400&q=80',
    'Chapati & Dal': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80',
    'Paneer Butter Masala': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    'default_veg': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
    'default_nonveg': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
};

export const getFoodImage = (foodName, isVeg) => {
    return FOOD_IMAGES[foodName] || (isVeg ? FOOD_IMAGES['default_veg'] : FOOD_IMAGES['default_nonveg']);
};

// Chennai-area sample data
const INITIAL_LISTINGS = [
    {
        id: 'L001', donorName: 'Hotel Saravana Bhavan', donorPhone: '9444123456',
        food: 'Veg Biryani', category: 'High Risk', weight: 4500, serves: 30,
        cookingTime: '11:30', storageType: 'Hot Case', location: 'T. Nagar, Chennai',
        lat: 13.0418, lng: 80.2341, distance: 2.1, status: 'approved',
        aiScore: 91, image: FOOD_IMAGES['Veg Biryani'],
        postedAt: new Date(Date.now() - 3600000).toISOString(),
        address: 'No. 77, Usman Road, T. Nagar, Chennai - 600017', isVeg: true,
        price: 120, originalPrice: 180, discount: 33
    },
    {
        id: 'L002', donorName: 'Anjappar Chettinad Restaurant', donorPhone: '9841234567',
        food: 'Chicken Curry', category: 'High Risk', weight: 6000, serves: 40,
        cookingTime: '12:00', storageType: 'Hot Case', location: 'Anna Nagar, Chennai',
        lat: 13.0850, lng: 80.2101, distance: 5.3, status: 'approved',
        aiScore: 87, image: FOOD_IMAGES['Chicken Curry'],
        postedAt: new Date(Date.now() - 7200000).toISOString(),
        address: 'Plot 23, 2nd Avenue, Anna Nagar, Chennai - 600040', isVeg: false,
        price: 150, originalPrice: 250, discount: 40
    },
    {
        id: 'L003', donorName: 'Sri Murugan Idli Shop', donorPhone: '9500234567',
        food: 'Idli & Sambar', category: 'Medium Risk', weight: 3000, serves: 50,
        cookingTime: '07:00', storageType: 'Room Temperature', location: 'Mylapore, Chennai',
        lat: 13.0339, lng: 80.2619, distance: 3.8, status: 'approved',
        aiScore: 94, image: FOOD_IMAGES['Idli & Sambar'],
        postedAt: new Date(Date.now() - 1800000).toISOString(),
        address: '14, Luz Church Road, Mylapore, Chennai - 600004', isVeg: true,
        price: 60, originalPrice: 100, discount: 40
    },
    {
        id: 'L004', donorName: 'Kalyana Mahal Wedding Hall', donorPhone: '9789012345',
        food: 'Sambar Rice', category: 'Medium Risk', weight: 15000, serves: 200,
        cookingTime: '13:00', storageType: 'Room Temperature', location: 'Tambaram, Chennai',
        lat: 12.9249, lng: 80.1000, distance: 18.5, status: 'review',
        aiScore: 68, image: FOOD_IMAGES['Sambar Rice'],
        postedAt: new Date(Date.now() - 5400000).toISOString(),
        address: '45, GST Road, Tambaram, Chennai - 600045', isVeg: true,
        price: 80, originalPrice: 140, discount: 43
    },
    {
        id: 'L005', donorName: 'Adyar Bakery', donorPhone: '9345678901',
        food: 'Bread & Buns', category: 'Low Risk', weight: 2000, serves: 60,
        cookingTime: '06:00', storageType: 'Sealed Packaging', location: 'Adyar, Chennai',
        lat: 13.0012, lng: 80.2565, distance: 6.2, status: 'approved',
        aiScore: 96, image: FOOD_IMAGES['Bread & Buns'],
        postedAt: new Date(Date.now() - 900000).toISOString(),
        address: '3, 4th Cross Street, Adyar, Chennai - 600020', isVeg: true,
        price: 40, originalPrice: 70, discount: 43
    },
    {
        id: 'L006', donorName: 'Buhari Hotel', donorPhone: '9677890123',
        food: 'Mutton Biryani', category: 'High Risk', weight: 8000, serves: 55,
        cookingTime: '14:00', storageType: 'Hot Case', location: 'Mount Road, Chennai',
        lat: 13.0569, lng: 80.2425, distance: 4.1, status: 'approved',
        aiScore: 89, image: FOOD_IMAGES['Mutton Biryani'],
        postedAt: new Date(Date.now() - 2700000).toISOString(),
        address: '83, Anna Salai, Mount Road, Chennai - 600002', isVeg: false,
        price: 180, originalPrice: 320, discount: 44
    },
];

const INITIAL_ORDERS = [
    {
        id: 'ORD001', listingId: 'L001', receiverName: 'Karthik Rajan',
        receiverPhone: '9876543210', receiverAddress: '12, 3rd Street, Saidapet, Chennai',
        quantity: 5, status: 'pending', agentId: null,
        pickupAddress: 'No. 77, Usman Road, T. Nagar, Chennai - 600017',
        donorPhone: '9444123456', donorName: 'Hotel Saravana Bhavan',
        food: 'Veg Biryani', distance: 2.1, earnings: 63,
        createdAt: new Date(Date.now() - 1200000).toISOString()
    },
    {
        id: 'ORD002', listingId: 'L006', receiverName: 'Priya Suresh',
        receiverPhone: '9123456789', receiverAddress: '5, Gandhi Nagar, Adyar, Chennai',
        quantity: 3, status: 'pending', agentId: null,
        pickupAddress: '83, Anna Salai, Mount Road, Chennai - 600002',
        donorPhone: '9677890123', donorName: 'Buhari Hotel',
        food: 'Mutton Biryani', distance: 4.1, earnings: 123,
        createdAt: new Date(Date.now() - 600000).toISOString()
    }
];

// Realistic delivery history that makes the stats consistent
// Agent has 312 total deliveries. We'll show the last 8 for UI, with earnings matching realistically.
// Average earnings per delivery ~= ₹285 (360 is just today's/recent session).
// We'll set totalEarnings as career total: ₹89,280 (312 deliveries × ₹286 avg)
const makeDeliveryDate = (daysAgo, hour = 14, minute = 30) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
};

const HISTORY_DELIVERIES = [
    {
        id: 'HIST001', food: 'Chicken Biryani', donorName: 'Buhari Hotel', receiverName: 'Karthik R.',
        pickupAddress: '83, Anna Salai, Mount Road', receiverAddress: '45, T. Nagar', receiverPhone: '9876543210', donorPhone: '9677890123',
        distance: 4.2, earnings: 126, status: 'delivered', deliveredAt: makeDeliveryDate(0, 10, 15), quantity: 3
    },
    {
        id: 'HIST002', food: 'Veg Biryani', donorName: 'Hotel Saravana Bhavan', receiverName: 'Priya S.',
        pickupAddress: 'No. 77, Usman Road, T. Nagar', receiverAddress: '12, Adyar', receiverPhone: '9123456789', donorPhone: '9444123456',
        distance: 3.8, earnings: 114, status: 'delivered', deliveredAt: makeDeliveryDate(0, 12, 45), quantity: 2
    },
    {
        id: 'HIST003', food: 'Idli & Sambar', donorName: 'Sri Murugan Idli Shop', receiverName: 'Meena D.',
        pickupAddress: '14, Luz Church Road, Mylapore', receiverAddress: '7, Nungambakkam', receiverPhone: '9234567890', donorPhone: '9500234567',
        distance: 4.0, earnings: 120, status: 'delivered', deliveredAt: makeDeliveryDate(1, 9, 0), quantity: 5
    },
    {
        id: 'HIST004', food: 'Mutton Biryani', donorName: 'Buhari Hotel', receiverName: 'Suresh K.',
        pickupAddress: '83, Anna Salai', receiverAddress: '20, Kodambakkam', receiverPhone: '9345678901', donorPhone: '9677890123',
        distance: 5.1, earnings: 153, status: 'delivered', deliveredAt: makeDeliveryDate(1, 14, 20), quantity: 4
    },
    {
        id: 'HIST005', food: 'Dosa & Chutney', donorName: 'Murugan Idli Kadai', receiverName: 'Anitha M.',
        pickupAddress: 'Purasawalkam, Chennai', receiverAddress: '3, Perambur', receiverPhone: '9456789012', donorPhone: '9600112233',
        distance: 3.2, earnings: 96, status: 'delivered', deliveredAt: makeDeliveryDate(2, 8, 30), quantity: 6
    },
    {
        id: 'HIST006', food: 'Chicken Curry', donorName: 'Anjappar Chettinad', receiverName: 'Ravi Kumar',
        pickupAddress: 'Plot 23, 2nd Avenue, Anna Nagar', receiverAddress: '8, Villivakkam', receiverPhone: '9567890123', donorPhone: '9841234567',
        distance: 6.5, earnings: 195, status: 'delivered', deliveredAt: makeDeliveryDate(2, 15, 10), quantity: 7
    },
    {
        id: 'HIST007', food: 'Sambar Rice', donorName: 'Kalyana Mahal', receiverName: 'Lakshmi N.',
        pickupAddress: '45, GST Road, Tambaram', receiverAddress: '22, Pallavaram', receiverPhone: '9678901234', donorPhone: '9789012345',
        distance: 2.5, earnings: 75, status: 'delivered', deliveredAt: makeDeliveryDate(3, 13, 0), quantity: 8
    },
    {
        id: 'HIST008', food: 'Bread & Buns', donorName: 'Adyar Bakery', receiverName: 'Vijay S.',
        pickupAddress: '3, 4th Cross Street, Adyar', receiverAddress: '56, Besant Nagar', receiverPhone: '9789012345', donorPhone: '9345678901',
        distance: 1.8, earnings: 54, status: 'delivered', deliveredAt: makeDeliveryDate(3, 7, 45), quantity: 10
    },
];

// Pre-populate some rejected and accepted history for realism
const HISTORY_REJECTED = [
    {
        id: 'REJ001', food: 'Fish Curry & Rice', donorName: 'Coastal Kitchen', receiverName: 'Ramesh P.',
        pickupAddress: 'Marina Beach Road, Chennai', receiverAddress: '15, Triplicane', receiverPhone: '9890123456', donorPhone: '9712345678',
        distance: 8.2, earnings: 246, status: 'rejected', rejectedAt: makeDeliveryDate(0, 9, 30), quantity: 2,
        rejectionReason: 'Distance too far for current route'
    },
    {
        id: 'REJ002', food: 'Pongal', donorName: 'Srirangam Temple Kitchen', receiverName: 'Devi R.',
        pickupAddress: 'Koyambedu, Chennai', receiverAddress: '67, Ambattur', receiverPhone: '9901234567', donorPhone: '9823456789',
        distance: 12.5, earnings: 375, status: 'rejected', rejectedAt: makeDeliveryDate(1, 11, 0), quantity: 4,
        rejectionReason: 'Low battery, could not complete delivery'
    },
    {
        id: 'REJ003', food: 'Chapati & Dal', donorName: 'Udupi Grand', receiverName: 'Senthil K.',
        pickupAddress: 'Vadapalani, Chennai', receiverAddress: '89, Ashok Nagar', receiverPhone: '9012345678', donorPhone: '9934567890',
        distance: 4.8, earnings: 144, status: 'rejected', rejectedAt: makeDeliveryDate(2, 16, 20), quantity: 3,
        rejectionReason: 'Heavy traffic, reassigned to another agent'
    },
];

const AGENT_PROFILE = {
    name: 'Murugesan Pillai',
    tamilName: 'முருகேசன் பிள்ளை',
    phone: '9944556677',
    area: 'T. Nagar & Mylapore, Chennai',
    rating: 4.8,
    totalDeliveries: 312,
    joinedDate: '2024-03-15',
    vehicleType: 'Two-Wheeler',
    vehicleNo: 'TN 09 BK 4521',
    badge: 'Gold Volunteer',
    // Career earnings = 312 deliveries × avg ₹286 each
    careerEarnings: 89232,
    // This month
    monthlyDeliveries: 48,
    monthlyEarnings: 14256,
    // Acceptance rate
    acceptanceRate: 94,
    // On-time rate
    onTimeRate: 97,
};

export const AppProvider = ({ children }) => {
    const [listings, setListings] = useState(INITIAL_LISTINGS);
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [agentDeliveries, setAgentDeliveries] = useState(HISTORY_DELIVERIES);
    const [agentRejected, setAgentRejected] = useState(HISTORY_REJECTED);
    const [agentAccepted, setAgentAccepted] = useState([]);
    const [agentProfile] = useState(AGENT_PROFILE);
    // Today's session earnings (from today's deliveries in history)
    const todayHistoryEarnings = HISTORY_DELIVERIES
        .filter(d => new Date(d.deliveredAt).toDateString() === new Date().toDateString())
        .reduce((sum, d) => sum + d.earnings, 0);
    const [todayEarnings, setTodayEarnings] = useState(todayHistoryEarnings);

    const addListing = (listing) => {
        // Attach real food image if not camera captured
        const enhancedListing = {
            ...listing,
            foodImage: getFoodImage(listing.food, listing.isVeg),
        };
        setListings(prev => [enhancedListing, ...prev]);
    };

    const placeOrder = (order) => {
        setOrders(prev => [order, ...prev]);
    };

    const acceptOrder = (orderId) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'accepted' } : o));
        const order = orders.find(o => o.id === orderId);
        if (order) setAgentAccepted(prev => [{ ...order, status: 'accepted', acceptedAt: new Date().toISOString() }, ...prev]);
    };

    const rejectOrder = (orderId) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'rejected' } : o));
        const order = orders.find(o => o.id === orderId);
        if (order) setAgentRejected(prev => [{
            ...order, status: 'rejected',
            rejectedAt: new Date().toISOString(),
            rejectionReason: 'Declined by agent'
        }, ...prev]);
    };

    const markPickedUp = (orderId) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'pickedup' } : o));
        setAgentAccepted(prev => prev.map(o => o.id === orderId ? { ...o, status: 'pickedup' } : o));
    };

    const markDelivered = (orderId) => {
        const order = orders.find(o => o.id === orderId) || agentAccepted.find(o => o.id === orderId);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'delivered' } : o));
        setAgentAccepted(prev => prev.filter(o => o.id !== orderId));
        if (order) {
            const deliveredEntry = { ...order, status: 'delivered', deliveredAt: new Date().toISOString() };
            setAgentDeliveries(prev => [deliveredEntry, ...prev]);
            setTodayEarnings(prev => prev + (order.earnings || 0));
        }
    };

    return (
        <AppContext.Provider value={{
            listings, addListing,
            orders, placeOrder,
            agentDeliveries, agentRejected, agentAccepted,
            acceptOrder, rejectOrder, markPickedUp, markDelivered,
            agentProfile, todayEarnings,
            getFoodImage,
        }}>
            {children}
        </AppContext.Provider>
    );
};
