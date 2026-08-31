import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveGeofenceMap } from './InteractiveGeofenceMap';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Clock, 
  DollarSign, 
  Tag, 
  Send, 
  Radio, 
  Check, 
  AlertCircle, 
  Smartphone,
  Flame,
  Layers,
  ChevronRight,
  ChevronLeft,
  Percent,
  Sliders,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { DealCategory, BusinessProfile, BusinessBranch } from '../../types';

interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  business?: BusinessProfile;
}

const CATEGORY_IMAGE_PRESETS: Record<DealCategory, { label: string; url: string }[]> = {
  cafe_coffee: [
    { label: 'Artisan Espresso & Latte', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80' },
    { label: 'Pastry & Breakfast Combo', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80' },
    { label: 'Cold Brew & Iced Coffee', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80' },
  ],
  restaurant_dining: [
    { label: 'Wood-Fired Pizza & Pasta', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80' },
    { label: 'Gourmet Burger & Craft Fries', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' },
    { label: 'Steakhouse & Wine Dinner', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80' },
  ],
  retail_fashion: [
    { label: 'Sneakers & Streetwear', url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80' },
    { label: 'Boutique Apparel Sale', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80' },
    { label: 'Accessories & Sunglasses', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80' },
  ],
  beauty_wellness: [
    { label: 'Spa Massage & Relaxation', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80' },
    { label: 'Hair Styling & Cut', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80' },
    { label: 'Skincare & Facial Treatment', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80' },
  ],
  entertainment_events: [
    { label: 'Live Music & Bar Night', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80' },
    { label: 'Arcade & VR Games', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80' },
  ],
  services_auto: [
    { label: 'Car Detailing & Wash', url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&auto=format&fit=crop&q=80' },
    { label: 'Oil Change & Tune Up', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80' },
  ]
};

const AI_SUGGESTIONS: Record<DealCategory, { title: string; desc: string; discount: number; radius: number }[]> = {
  cafe_coffee: [
    {
      title: 'Afternoon Slump Special: 40% Off Flat Whites & Croissants',
      desc: 'Beat the 2pm slump! Enjoy fresh roast barista coffees and baked pastries within 350m of our cafe.',
      discount: 40,
      radius: 350
    },
    {
      title: 'Lunchtime Pair: Free Pastry with any Cold Brew',
      desc: 'Flash offer valid for the next 90 minutes. Show QR code at the register.',
      discount: 30,
      radius: 500
    }
  ],
  restaurant_dining: [
    {
      title: 'Early Bird Dinner: 35% Off All Wood-Fired Pizzas',
      desc: 'Table seating available right now! Freshly baked artisanal sourdough pizza with local SA produce.',
      discount: 35,
      radius: 800
    },
    {
      title: 'Express Executive Lunch: $16 Burger, Fries & Drink Combo',
      desc: 'Quick 10-minute turnaround for CBD workers. Tap to claim before tables fill up.',
      discount: 25,
      radius: 400
    }
  ],
  retail_fashion: [
    {
      title: 'CBD Streetwear Flash: 30% Off Limited Footwear Drops',
      desc: 'Exclusive walk-in voucher. 15 pairs remaining in Adelaide CBD flagship.',
      discount: 30,
      radius: 600
    }
  ],
  beauty_wellness: [
    {
      title: 'Walk-In Slot Alert: 50% Off 45-min Deep Tissue Massage',
      desc: 'Last minute cancellation slot open at 3:30pm today. First to arrive gets the discount.',
      discount: 50,
      radius: 1200
    }
  ],
  entertainment_events: [
    {
      title: 'Happy Hour Entry: 2-for-1 Cocktail & Tapas Voucher',
      desc: 'Live acoustic set kicks off at 5pm. Geofenced offer for patrons on King William St.',
      discount: 50,
      radius: 500
    }
  ],
  services_auto: [
    {
      title: 'Rainy Day Express Wash: 40% Off Deluxe Wax & Polish',
      desc: 'Drive-in queue is currently empty. Get your car cleaned in 20 minutes.',
      discount: 40,
      radius: 1500
    }
  ]
};

export const CreateDealModal: React.FC<CreateDealModalProps> = ({
  isOpen,
  onClose,
  business
}) => {
  const { 
    businesses, 
    publishNewDeal, 
    formatCurrency, 
    activeCurrency,
    language 
  } = useApp();

  const activeBiz = business || businesses[0];
  const [currentStep, setCurrentStep] = useState<'offer' | 'geofence' | 'timing'>('offer');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DealCategory>(activeBiz.category || 'cafe_coffee');
  const [discountPercent, setDiscountPercent] = useState<number>(30);
  const [originalPriceCents, setOriginalPriceCents] = useState<number>(1800); // $18.00
  const [radiusMeters, setRadiusMeters] = useState<number>(500);
  const [durationHours, setDurationHours] = useState<number>(3);
  const [maxRedemptions, setMaxRedemptions] = useState<number>(50);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(activeBiz.branches[0]?.id || 'branch_1');
  const [imageUrl, setImageUrl] = useState<string>(CATEGORY_IMAGE_PRESETS[category]?.[0]?.url || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80');
  const [terms, setTerms] = useState('Valid for in-store walk-in customers. Present QR code at register. Limit 1 per customer.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const selectedBranch = activeBiz.branches.find(b => b.id === selectedBranchId) || activeBiz.branches[0] || {
    id: 'branch_default',
    branchName: activeBiz.businessName,
    address: 'Adelaide CBD, South Australia',
    lat: -34.9285,
    lng: 138.6007,
    phone: '+61 8 8200 0000',
    openingHours: 'Mon-Sun: 7am - 8pm',
    isActive: true,
    businessId: activeBiz.id
  };

  const discountedPriceCents = Math.round(originalPriceCents * (1 - discountPercent / 100));
  const savingsCents = originalPriceCents - discountedPriceCents;

  const handleApplyAiSuggestion = () => {
    const list = AI_SUGGESTIONS[category] || AI_SUGGESTIONS.cafe_coffee;
    const randomItem = list[Math.floor(Math.random() * list.length)];
    setTitle(randomItem.title);
    setDescription(randomItem.desc);
    setDiscountPercent(randomItem.discount);
    setRadiusMeters(randomItem.radius);
  };

  const handleCategoryChange = (newCat: DealCategory) => {
    setCategory(newCat);
    const presets = CATEGORY_IMAGE_PRESETS[newCat];
    if (presets && presets.length > 0) {
      setImageUrl(presets[0].url);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const expiryDate = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

    setTimeout(() => {
      publishNewDeal({
        businessId: activeBiz.id,
        businessName: activeBiz.businessName,
        businessLogo: activeBiz.logoUrl,
        businessCategory: category,
        branchIds: [selectedBranch.id],
        title: title.trim(),
        description: description.trim() || 'Exclusive hyper-local flash offer in Adelaide.',
        discountPercentage: discountPercent,
        originalPriceCents: originalPriceCents,
        discountedPriceCents: discountedPriceCents,
        radiusMeters: radiusMeters,
        imageUrl: imageUrl,
        termsAndConditions: terms,
        expiryTimestamp: expiryDate,
        targetMaxRedemptions: maxRedemptions,
        location: {
          lat: selectedBranch.lat,
          lng: selectedBranch.lng,
          address: selectedBranch.address,
          suburb: 'Adelaide CBD'
        }
      });

      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-heading font-bold text-slate-900">
                  Create Geofenced Flash Deal
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Sub-60s Push SLA
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {activeBiz.businessName} • PostGIS Instant Audience Dispatch
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setCurrentStep('offer')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              currentStep === 'offer'
                ? 'border-amber-500 text-amber-900 bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] flex items-center justify-center font-bold">1</span>
            Offer &amp; Pricing
          </button>

          <button
            onClick={() => setCurrentStep('geofence')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              currentStep === 'geofence'
                ? 'border-amber-500 text-amber-900 bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] flex items-center justify-center font-bold">2</span>
            Geofence &amp; Radar Map
          </button>

          <button
            onClick={() => setCurrentStep('timing')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              currentStep === 'timing'
                ? 'border-amber-500 text-amber-900 bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] flex items-center justify-center font-bold">3</span>
            Schedule &amp; Preview
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <form id="create-deal-form" onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* STEP 1: OFFER & PRICING */}
            {currentStep === 'offer' && (
              <div className="space-y-5 animate-in fade-in">
                
                {/* AI Assistant Banner */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Need inspiration for maximum foot traffic?</h4>
                      <p className="text-[11px] text-slate-600">Auto-craft high-converting deal copy and optimal discounts tailored to your category.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyAiSuggestion}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auto-Suggest Copy</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Deal Category</label>
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value as DealCategory)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                    >
                      <option value="cafe_coffee">☕ Café &amp; Artisan Coffee</option>
                      <option value="restaurant_dining">🍽️ Restaurant &amp; Dining</option>
                      <option value="retail_fashion">🛍️ Retail &amp; Fashion</option>
                      <option value="beauty_wellness">💆 Beauty &amp; Wellness</option>
                      <option value="entertainment_events">🎟️ Entertainment &amp; Events</option>
                      <option value="services_auto">🚗 Automotive &amp; Services</option>
                    </select>
                  </div>

                  {/* Target Redemptions Cap */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 block">Max Redemptions Cap</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        max="500"
                        value={maxRedemptions}
                        onChange={(e) => setMaxRedemptions(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-xs text-slate-500 whitespace-nowrap">vouchers</span>
                    </div>
                  </div>
                </div>

                {/* Deal Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Deal Headline / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 40% Off Fresh Pastries & Barista Flat Whites"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Deal Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">Offer Description &amp; Highlights</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the offer, restrictions, or special ingredients..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Pricing & Discount Interactive Engine */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Percent className="w-4 h-4 text-amber-600" />
                      Discount &amp; Pricing Calculator
                    </span>
                    <span className="text-sm font-extrabold text-amber-700 font-mono">
                      {discountPercent}% OFF
                    </span>
                  </div>

                  {/* Discount Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>5%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>80%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      step="5"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Original Price</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-slate-400">$</span>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          value={(originalPriceCents / 100).toFixed(2)}
                          onChange={(e) => setOriginalPriceCents(Math.round(Number(e.target.value) * 100))}
                          className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Discounted Price</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono mt-1 block">
                        {formatCurrency(discountedPriceCents)}
                      </span>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Customer Saves</span>
                      <span className="text-xs font-bold text-emerald-800 font-mono mt-1 block">
                        {formatCurrency(savingsCents)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preset Image Chooser */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Cover Photo</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORY_IMAGE_PRESETS[category]?.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setImageUrl(preset.url)}
                        className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-video group ${
                          imageUrl === preset.url ? 'border-amber-500 ring-2 ring-amber-400/50' : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-1.5">
                          <span className="text-[9px] text-white font-medium truncate">{preset.label}</span>
                        </div>
                        {imageUrl === preset.url && (
                          <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* STEP 2: GEOFENCING & RADAR MAP */}
            {currentStep === 'geofence' && (
              <div className="space-y-5 animate-in fade-in">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">PostGIS Geofence Boundary &amp; Radius</h3>
                    <p className="text-xs text-slate-500">Only shoppers actively walking within this perimeter will receive the push notification.</p>
                  </div>

                  {/* Branch Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Branch:</span>
                    <select
                      value={selectedBranchId}
                      onChange={(e) => setSelectedBranchId(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none"
                    >
                      {activeBiz.branches.map(b => (
                        <option key={b.id} value={b.id}>{b.branchName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Interactive Map */}
                <InteractiveGeofenceMap
                  centerLat={selectedBranch.lat}
                  centerLng={selectedBranch.lng}
                  radiusMeters={radiusMeters}
                  onRadiusChange={setRadiusMeters}
                  branchName={selectedBranch.branchName}
                  address={selectedBranch.address}
                  heightClass="h-80"
                />

                {/* Geofence Strategy Explanation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">50m – 250m (Immediate Walk-In)</span>
                    <p className="text-slate-500 text-[11px]">Best for urgent flash deals (e.g. coffee slump, empty lunchtime tables).</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">500m – 1000m (CBD Walking Distance)</span>
                    <p className="text-slate-500 text-[11px]">Reaches entire city mall corridors within a 5-10 minute walk.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">2000m – 5000m (Suburban Reach)</span>
                    <p className="text-slate-500 text-[11px]">Great for retail sales, beauty appointments, and destination dining.</p>
                  </div>
                </div>

              </div>
            )}

            {/* STEP 3: TIMING, SCHEDULE & MOBILE PREVIEW */}
            {currentStep === 'timing' && (
              <div className="space-y-5 animate-in fade-in">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Timing Controls */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Flash Sale Duration &amp; Terms</h3>

                    {/* Duration Picker */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 block">Offer Active Duration</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 6].map(hours => (
                          <button
                            key={hours}
                            type="button"
                            onClick={() => setDurationHours(hours)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                              durationHours === hours
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {hours} {hours === 1 ? 'Hour' : 'Hours'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Instant Dispatch SLA notice */}
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold">
                        <Radio className="w-4 h-4 text-emerald-600" />
                        <span>Instant Push SLA Guarantee</span>
                      </div>
                      <p className="text-emerald-800 text-[11px]">
                        Upon publishing, our Redis Stream and FCM push pipeline dispatches notifications to all {radiusMeters}m geofenced shoppers in &lt;60 seconds.
                      </p>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 block">Terms of Redemption</label>
                      <textarea
                        rows={3}
                        value={terms}
                        onChange={(e) => setTerms(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Right Column: Live Mobile Consumer Preview */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">Shopper App Live Preview</span>
                    
                    <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 text-white shadow-xl max-w-sm mx-auto">
                      {/* Push Notification Header Simulation */}
                      <div className="bg-slate-800/90 rounded-2xl p-2.5 mb-3 border border-slate-700 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-amber-400 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> FORSA-T RADAR
                          </span>
                          <span>now</span>
                        </div>
                        <p className="text-xs font-bold text-slate-100 truncate">{title || 'Flash Discount Alert!'}</p>
                        <p className="text-[11px] text-slate-400 truncate">{activeBiz.businessName} • {radiusMeters}m away</p>
                      </div>

                      {/* In-App Deal Card */}
                      <div className="bg-white rounded-2xl overflow-hidden text-slate-900 shadow-md">
                        <div className="relative h-28">
                          <img src={imageUrl} alt="Deal preview" className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                            {discountPercent}% OFF
                          </div>
                          <div className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{durationHours}h 00m</span>
                          </div>
                        </div>

                        <div className="p-3 space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            <span>{selectedBranch.branchName} • ~180m</span>
                          </div>

                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                            {title || 'Deal Headline Goes Here'}
                          </h4>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                            <div>
                              <span className="text-[10px] text-slate-400 line-through mr-1.5 font-mono">
                                {formatCurrency(originalPriceCents)}
                              </span>
                              <span className="text-xs font-extrabold text-emerald-700 font-mono">
                                {formatCurrency(discountedPriceCents)}
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Claim Deal
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </form>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            {currentStep !== 'offer' && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep === 'timing' ? 'geofence' : 'offer')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>

            {currentStep !== 'timing' ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep === 'offer' ? 'geofence' : 'timing')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="create-deal-form"
                disabled={isSubmitting || !title.trim()}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Dispatching Geofence...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish &amp; Broadcast Deal</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
