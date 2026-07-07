import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { wishlistService } from '../services';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import './WishlistPage.css';

export default function WishlistPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['wishlists'],
    queryFn: () => wishlistService.getAll(),
    select: (res) => res.data.wishlists,
  });

  const removeMutation = useMutation({
    mutationFn: (listingId) => wishlistService.toggle(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success('Removed from wishlist');
    },
  });

  // Flatten all wishlisted listings from all wishlists
  const allListings = data?.flatMap(w => w.listings) ?? [];

  return (
    <div className="wishlist-page">
      <Header />
      <main className="wishlist-page__main container">
        <div className="wishlist-page__header">
          <h1>Wishlists</h1>
          {user && (
            <p className="wishlist-page__subtitle">{user.name}'s saved homes</p>
          )}
        </div>

        {isLoading ? (
          <div className="wishlist-page__grid">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="wishlist-card wishlist-card--skeleton">
                <div className="skeleton wishlist-card__img" />
                <div className="wishlist-card__info">
                  <div className="skeleton" style={{ height: 16, width: '70%', borderRadius: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '40%', borderRadius: 8, marginTop: 8 }} />
                </div>
              </div>
            ))}
          </div>
        ) : allListings.length === 0 ? (
          <div className="wishlist-page__empty">
            <div className="wishlist-page__empty-icon">
              <Heart size={48} strokeWidth={1.5} />
            </div>
            <h2>Nothing saved yet</h2>
            <p>As you search, click the heart icon to save your favourite places and experiences to a wishlist.</p>
            <Link to="/" className="wishlist-page__explore-btn">
              Start exploring
            </Link>
          </div>
        ) : (
          <div className="wishlist-page__grid">
            <AnimatePresence>
              {allListings.map((listing) => (
                <motion.div
                  key={listing._id}
                  className="wishlist-card"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Link to={`/rooms/${listing._id}`} className="wishlist-card__img-wrap">
                    <img
                      src={listing.images?.[0]?.url}
                      alt={listing.title}
                      className="wishlist-card__img"
                      loading="lazy"
                    />
                    <div className="wishlist-card__badge">Guest favourite</div>
                  </Link>

                  <div className="wishlist-card__info">
                    <div className="wishlist-card__meta">
                      <Link to={`/rooms/${listing._id}`} className="wishlist-card__title">
                        {listing.location?.city}, {listing.location?.country}
                      </Link>
                      <p className="wishlist-card__subtitle">{listing.title}</p>
                      <p className="wishlist-card__price">
                        <strong>₹{listing.pricePerNight?.toLocaleString('en-IN')}</strong> / night
                      </p>
                    </div>
                    <button
                      className="wishlist-card__remove"
                      onClick={() => removeMutation.mutate(listing._id)}
                      aria-label="Remove from wishlist"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
