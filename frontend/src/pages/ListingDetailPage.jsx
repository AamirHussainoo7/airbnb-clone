import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Share2, Heart, ChevronLeft, X, MapPin, Wifi, Car, Waves, Utensils, Flame, Wind, Tv, Coffee, Dumbbell } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { format, differenceInCalendarDays } from 'date-fns';
import { DateRange } from 'react-date-range';
import Header from '../components/Header/Header';
import { listingsService, reviewsService, bookingsService } from '../services';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './ListingDetailPage.css';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const AMENITY_ICONS = {
  'WiFi': <Wifi size={20} />, 'Parking': <Car size={20} />, 'Pool': <Waves size={20} />,
  'Kitchen': <Utensils size={20} />, 'Fireplace': <Flame size={20} />, 'AC': <Wind size={20} />,
  'Netflix': <Tv size={20} />, 'Coffee machine': <Coffee size={20} />, 'Gym': <Dumbbell size={20} />,
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [dateRange, setDateRange] = useState([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0, pets: 0 });
  const [bookingLoading, setBookingLoading] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingsService.getById(id),
    select: (res) => res.data.listing,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewsService.getByListing(id),
    select: (res) => res.data.reviews,
  });

  const checkIn = dateRange[0].startDate;
  const checkOut = dateRange[0].endDate;
  const nights = differenceInCalendarDays(checkOut, checkIn) || 1;
  const pricePerNight = listing?.pricePerNight || 0;
  const cleaningFee = Math.round(pricePerNight * 0.15);
  const serviceFee = Math.round(pricePerNight * nights * 0.14);
  const total = pricePerNight * nights + cleaningFee + serviceFee;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to make a reservation');
      return;
    }
    if (nights < 1) {
      toast.error('Please select valid dates');
      return;
    }
    setBookingLoading(true);
    try {
      await bookingsService.create({
        listingId: id,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
      });
      toast.success('Reservation confirmed! 🎉');
      navigate('/trips');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="detail-page">
        <Header />
        <div className="detail-page__loading container">
          <div className="skeleton" style={{ height: '48px', width: '60%', marginBottom: '16px' }} />
          <div className="skeleton" style={{ height: '480px', borderRadius: '16px' }} />
        </div>
      </div>
    );
  }

  if (!listing) return null;

  const images = listing.images?.length ? listing.images : [{ url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' }];
  const lat = listing.location?.lat || 28.6139;
  const lng = listing.location?.lng || 77.2090;

  return (
    <div className="detail-page">
      <Header />
      <main className="detail-page__main container">
        {/* Back Button */}
        <button className="detail-page__back" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Back to results
        </button>

        {/* Title */}
        <h1 className="detail-page__title">{listing.title}</h1>

        {/* Sub-header */}
        <div className="detail-page__subheader">
          <div className="detail-page__meta">
            {listing.rating > 0 && (
              <span className="detail-page__rating">
                <Star size={14} fill="#222" stroke="none" />
                {listing.rating.toFixed(2)}
              </span>
            )}
            {listing.reviewCount > 0 && (
              <button className="detail-page__reviews-link">
                · {listing.reviewCount} reviews ·
              </button>
            )}
            {listing.host?.isSuperhost && (
              <span className="detail-page__superhost">🏅 Superhost ·</span>
            )}
            <span className="detail-page__location-text">
              <MapPin size={13} /> {listing.location?.city}, {listing.location?.country}
            </span>
          </div>
          <div className="detail-page__actions">
            <button className="detail-page__action-btn">
              <Share2 size={16} /> Share
            </button>
            <button className="detail-page__action-btn">
              <Heart size={16} /> Save
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="detail-page__gallery" id="photo-gallery">
          <div className="detail-page__gallery-main">
            <img src={images[0]?.url} alt={listing.title} loading="eager" />
          </div>
          <div className="detail-page__gallery-grid">
            {images.slice(1, 5).map((img, i) => (
              <div key={i} className="detail-page__gallery-thumb">
                <img src={img.url} alt={`${listing.title} ${i + 2}`} loading="lazy" />
              </div>
            ))}
          </div>
          <button
            className="detail-page__show-all-btn"
            onClick={() => setShowAllPhotos(true)}
            id="show-all-photos-btn"
          >
            Show all photos
          </button>
        </div>

        {/* Content */}
        <div className="detail-page__content">
          {/* Left Column */}
          <div className="detail-page__left">
            {/* Property Info */}
            <div className="detail-page__property-header">
              <div>
                <h2 className="detail-page__property-type">
                  {listing.propertyType} in {listing.location?.city}
                </h2>
                <p className="detail-page__specs">
                  {listing.maxGuests} guests · {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''} ·
                  {' '}{listing.beds} bed{listing.beds !== 1 ? 's' : ''} ·
                  {' '}{listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="detail-page__host-avatar">
                <img src={listing.host?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} alt={listing.host?.name} />
              </div>
            </div>

            {/* Highlights */}
            <div className="detail-page__divider" />
            <div className="detail-page__highlights">
              {listing.host?.isSuperhost && (
                <div className="detail-page__highlight">
                  <span className="detail-page__highlight-icon">🏅</span>
                  <div>
                    <strong>{listing.host?.name} is a Superhost</strong>
                    <p>Superhosts are experienced, highly rated hosts who are committed to providing great stays.</p>
                  </div>
                </div>
              )}
              <div className="detail-page__highlight">
                <span className="detail-page__highlight-icon">🔑</span>
                <div>
                  <strong>Great check-in experience</strong>
                  <p>95% of recent guests gave the check-in process a 5-star rating.</p>
                </div>
              </div>
              <div className="detail-page__highlight">
                <span className="detail-page__highlight-icon">📍</span>
                <div>
                  <strong>Great location</strong>
                  <p>90% of recent guests gave the location a 5-star rating.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="detail-page__divider" />
            <div className="detail-page__description">
              <p>{listing.description}</p>
            </div>

            {/* Amenities */}
            <div className="detail-page__divider" />
            <h2 className="detail-page__section-title">What this place offers</h2>
            <div className="detail-page__amenities">
              {listing.amenities?.slice(0, 10).map((amenity) => (
                <div key={amenity} className="detail-page__amenity">
                  <span className="detail-page__amenity-icon">
                    {AMENITY_ICONS[amenity] || '✓'}
                  </span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>

            {/* Date Picker */}
            <div className="detail-page__divider" />
            <h2 className="detail-page__section-title">
              {nights} night{nights !== 1 ? 's' : ''} in {listing.location?.city}
            </h2>
            <p className="detail-page__date-subtitle">
              {format(checkIn, 'MMM d, yyyy')} – {format(checkOut, 'MMM d, yyyy')}
            </p>
            <div className="detail-page__calendar">
              <DateRange
                ranges={dateRange}
                onChange={(ranges) => setDateRange([ranges.selection])}
                months={2}
                direction="horizontal"
                showDateDisplay={false}
                minDate={new Date()}
                rangeColors={['#FF385C']}
              />
            </div>

            {/* Reviews */}
            {reviews?.length > 0 && (
              <>
                <div className="detail-page__divider" />
                <div className="detail-page__reviews-header">
                  <Star size={18} fill="#222" stroke="none" />
                  <h2 className="detail-page__section-title" style={{ margin: 0 }}>
                    {listing.rating?.toFixed(2)} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </h2>
                </div>
                <div className="detail-page__reviews-grid">
                  {reviews.slice(0, 6).map((review) => (
                    <div key={review._id} className="detail-page__review">
                      <div className="detail-page__review-header">
                        <img
                          src={review.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                          alt={review.author?.name}
                          className="detail-page__review-avatar"
                        />
                        <div>
                          <div className="detail-page__review-name">{review.author?.name}</div>
                          <div className="detail-page__review-date">
                            {format(new Date(review.createdAt), 'MMMM yyyy')}
                          </div>
                        </div>
                      </div>
                      <p className="detail-page__review-text">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Map */}
            <div className="detail-page__divider" />
            <h2 className="detail-page__section-title">Where you'll be</h2>
            <p className="detail-page__map-location">
              {listing.location?.city}, {listing.location?.state}, {listing.location?.country}
            </p>
            <div className="detail-page__map">
              <MapContainer center={[lat, lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[lat, lng]}>
                  <Popup>{listing.title}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Right Column — Booking Widget */}
          <div className="detail-page__right">
            <div className="detail-page__booking-card">
              <div className="detail-page__booking-price">
                <span className="detail-page__booking-amount">{formatCurrency(pricePerNight)}</span>
                <span className="detail-page__booking-night"> night</span>
              </div>
              <div className="detail-page__booking-rating">
                <Star size={12} fill="#222" stroke="none" />
                <span>{listing.rating?.toFixed(2)}</span>
                <span className="detail-page__booking-reviews">· {listing.reviewCount} reviews</span>
              </div>

              {/* Date Selector */}
              <div className="detail-page__booking-dates">
                <div className="detail-page__booking-date-field">
                  <label>CHECK-IN</label>
                  <span>{format(checkIn, 'MM/dd/yyyy')}</span>
                </div>
                <div className="detail-page__booking-date-divider" />
                <div className="detail-page__booking-date-field">
                  <label>CHECKOUT</label>
                  <span>{format(checkOut, 'MM/dd/yyyy')}</span>
                </div>
              </div>
              <div className="detail-page__booking-guests">
                <label>GUESTS</label>
                <span>{guests.adults + guests.children} guest{guests.adults + guests.children !== 1 ? 's' : ''}</span>
              </div>

              <button
                className="detail-page__reserve-btn"
                onClick={handleBook}
                disabled={bookingLoading}
                id="reserve-btn"
              >
                {bookingLoading ? 'Reserving...' : 'Reserve'}
              </button>
              <p className="detail-page__no-charge">You won't be charged yet</p>

              {/* Fee Breakdown */}
              <div className="detail-page__fee-breakdown">
                <div className="detail-page__fee-row">
                  <span>{formatCurrency(pricePerNight)} × {nights} night{nights !== 1 ? 's' : ''}</span>
                  <span>{formatCurrency(pricePerNight * nights)}</span>
                </div>
                <div className="detail-page__fee-row">
                  <span className="detail-page__fee-underline">Cleaning fee</span>
                  <span>{formatCurrency(cleaningFee)}</span>
                </div>
                <div className="detail-page__fee-row">
                  <span className="detail-page__fee-underline">Airbnb service fee</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                <div className="detail-page__fee-divider" />
                <div className="detail-page__fee-row detail-page__fee-total">
                  <span>Total before taxes</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* All Photos Modal */}
      <AnimatePresence>
        {showAllPhotos && (
          <motion.div
            className="photos-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="photos-modal__close" onClick={() => setShowAllPhotos(false)}>
              <X size={20} />
            </button>
            <div className="photos-modal__grid">
              {images.map((img, i) => (
                <img key={i} src={img.url} alt={`${listing.title} ${i + 1}`} loading="lazy" />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
