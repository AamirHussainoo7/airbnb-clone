import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import Header from '../components/Header/Header';
import { listingsService } from '../services';
import toast from 'react-hot-toast';
import './CreateListingPage.css';

const CATEGORIES = [
  'Beach', 'Cabins', 'Amazing pools', 'Countryside', 'Castles',
  'Design', 'Treehouses', 'Tropical', 'Luxe', 'Trending',
];

const AMENITIES_LIST = [
  'WiFi', 'Kitchen', 'Parking', 'Pool', 'AC', 'Fireplace',
  'Washer', 'Dryer', 'TV', 'Heating', 'Gym', 'Hot tub',
  'Beach access', 'Breakfast', 'Pets allowed',
];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Beach',
    location: { address: '', city: '', state: '', country: '', lat: 0, lng: 0 },
    pricePerNight: '', maxGuests: 2, bedrooms: 1, bathrooms: 1, beds: 1,
    amenities: [], propertyType: 'Entire place',
    images: [
      { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', publicId: '' }
    ],
  });

  const mutation = useMutation({
    mutationFn: (data) => listingsService.create(data),
    onSuccess: (res) => {
      toast.success('Listing created! 🎉');
      navigate(`/rooms/${res.data.listing._id}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create listing'),
  });

  const updateForm = (key, value) => setForm(f => ({ ...f, [key]: value }));
  const updateLocation = (key, value) =>
    setForm(f => ({ ...f, location: { ...f.location, [key]: value } }));
  const toggleAmenity = (amenity) =>
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter(a => a !== amenity)
        : [...f.amenities, amenity],
    }));

  const handleSubmit = () => {
    if (!form.title || !form.description || !form.location.city || !form.pricePerNight) {
      toast.error('Please fill in all required fields');
      return;
    }
    mutation.mutate({ ...form, pricePerNight: Number(form.pricePerNight) });
  };

  const TOTAL_STEPS = 4;

  return (
    <div className="create-listing">
      <Header />
      <main className="create-listing__main">
        {/* Progress bar */}
        <div className="create-listing__progress">
          <div
            className="create-listing__progress-bar"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <div className="create-listing__content container">
          {step === 1 && (
            <div className="create-listing__step">
              <h2>Tell us about your place</h2>
              <p>Share some basics about your place, we'll add the details later.</p>

              <div className="create-listing__field">
                <label>Property type</label>
                <select value={form.propertyType} onChange={e => updateForm('propertyType', e.target.value)}>
                  {['Entire place', 'Private room', 'Hotel room', 'Shared room'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="create-listing__field">
                <label>Category *</label>
                <select value={form.category} onChange={e => updateForm('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="create-listing__counters">
                {[
                  { label: 'Guests', key: 'maxGuests', min: 1 },
                  { label: 'Bedrooms', key: 'bedrooms', min: 0 },
                  { label: 'Beds', key: 'beds', min: 1 },
                  { label: 'Bathrooms', key: 'bathrooms', min: 1 },
                ].map(({ label, key, min }) => (
                  <div key={key} className="create-listing__counter-row">
                    <span>{label}</span>
                    <div className="create-listing__counter-ctrl">
                      <button onClick={() => updateForm(key, Math.max(min, form[key] - 1))}>−</button>
                      <span>{form[key]}</span>
                      <button onClick={() => updateForm(key, form[key] + 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="create-listing__step">
              <h2>Where is your place located?</h2>
              <p>Guests will only get your exact address once they've booked a reservation.</p>
              {[
                { label: 'City *', key: 'city', placeholder: 'e.g. Goa' },
                { label: 'State', key: 'state', placeholder: 'e.g. Goa' },
                { label: 'Country *', key: 'country', placeholder: 'e.g. India' },
                { label: 'Address', key: 'address', placeholder: 'Street address' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="create-listing__field">
                  <label>{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form.location[key]}
                    onChange={e => updateLocation(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="create-listing__step">
              <h2>Make your place stand out</h2>
              <p>Add a title, description, and amenities to attract guests.</p>
              <div className="create-listing__field">
                <label>Listing title *</label>
                <input
                  type="text"
                  placeholder="e.g. Beachfront Villa with Private Pool"
                  value={form.title}
                  onChange={e => updateForm('title', e.target.value)}
                  maxLength={200}
                />
                <span className="create-listing__char-count">{form.title.length}/200</span>
              </div>
              <div className="create-listing__field">
                <label>Description *</label>
                <textarea
                  placeholder="Tell guests what makes your place special..."
                  value={form.description}
                  onChange={e => updateForm('description', e.target.value)}
                  rows={6}
                  maxLength={2000}
                />
                <span className="create-listing__char-count">{form.description.length}/2000</span>
              </div>
              <div className="create-listing__field">
                <label>Amenities</label>
                <div className="create-listing__amenities-grid">
                  {AMENITIES_LIST.map(amenity => (
                    <button
                      key={amenity}
                      className={`create-listing__amenity-btn ${form.amenities.includes(amenity) ? 'active' : ''}`}
                      onClick={() => toggleAmenity(amenity)}
                      type="button"
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="create-listing__step">
              <h2>Set your price</h2>
              <p>You can change it anytime after publishing.</p>
              <div className="create-listing__price-field">
                <span className="create-listing__currency">₹</span>
                <input
                  type="number"
                  placeholder="0"
                  value={form.pricePerNight}
                  onChange={e => updateForm('pricePerNight', e.target.value)}
                  min={1}
                  className="create-listing__price-input"
                />
              </div>
              <p className="create-listing__price-helper">
                Per night · Cleaning fee (15%) and service fee (14%) are calculated automatically.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="create-listing__nav">
            <button
              className="create-listing__nav-btn create-listing__nav-btn--back"
              onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}
            >
              <ChevronLeft size={16} /> {step > 1 ? 'Back' : 'Exit'}
            </button>
            {step < TOTAL_STEPS ? (
              <button
                className="create-listing__nav-btn create-listing__nav-btn--next"
                onClick={() => setStep(s => s + 1)}
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                className="create-listing__nav-btn create-listing__nav-btn--publish"
                onClick={handleSubmit}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Publishing...' : 'Publish listing'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
