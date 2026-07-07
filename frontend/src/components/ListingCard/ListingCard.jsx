import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { wishlistService } from '../../services';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import './ListingCard.css';

export default function ListingCard({ listing }) {
  const { isAuthenticated } = useAuthStore();
  const [currentImg, setCurrentImg] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const images = listing.images?.length ? listing.images : [{ url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800' }];

  const prevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImg((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const nextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImg((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please log in to save listings');
      return;
    }
    try {
      const { data } = await wishlistService.toggle(listing._id);
      setIsWishlisted(data.saved);
      toast.success(data.saved ? 'Saved to wishlist' : 'Removed from wishlist');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      className="listing-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Link to={`/rooms/${listing._id}`} className="listing-card__link">
        {/* Image Gallery */}
        <div className="listing-card__gallery">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImg}
              src={images[currentImg]?.url}
              alt={listing.title}
              className="listing-card__img"
              initial={{ opacity: 0 }}
              animate={{ opacity: imgLoaded ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onLoad={() => setImgLoaded(true)}
              loading="lazy"
            />
          </AnimatePresence>

          {/* Shimmer while loading */}
          {!imgLoaded && <div className="listing-card__img-skeleton skeleton" />}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                className="listing-card__arrow listing-card__arrow--left"
                onClick={prevImg}
                aria-label="Previous photo"
              >
                <ChevronLeft size={14} strokeWidth={3} />
              </button>
              <button
                className="listing-card__arrow listing-card__arrow--right"
                onClick={nextImg}
                aria-label="Next photo"
              >
                <ChevronRight size={14} strokeWidth={3} />
              </button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="listing-card__dots">
              {images.slice(0, 5).map((_, i) => (
                <span
                  key={i}
                  className={`listing-card__dot ${i === currentImg ? 'listing-card__dot--active' : ''}`}
                />
              ))}
            </div>
          )}

          {/* Guest Favorite Badge */}
          {listing.isGuestFavorite && (
            <div className="listing-card__badge">Guest favorite</div>
          )}

          {/* Heart Button */}
          <button
            className={`listing-card__heart ${isWishlisted ? 'listing-card__heart--active' : ''}`}
            onClick={toggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={20}
              fill={isWishlisted ? '#FF385C' : 'none'}
              stroke={isWishlisted ? '#FF385C' : 'white'}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Info */}
        <div className="listing-card__info">
          <div className="listing-card__header">
            <div className="listing-card__location">
              {listing.location?.city}, {listing.location?.country}
            </div>
            {listing.rating > 0 && (
              <div className="listing-card__rating">
                <Star size={12} fill="#222" stroke="none" />
                <span>{listing.rating.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="listing-card__host">
            Hosted by {listing.host?.name || 'Superhost'}
          </div>
          <div className="listing-card__dates">
            {listing.reviewCount > 0 ? `${listing.reviewCount} reviews` : 'New listing'}
          </div>
          <div className="listing-card__price">
            <span className="listing-card__price-amount">{formatPrice(listing.pricePerNight)}</span>
            <span className="listing-card__price-unit"> night</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
