import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { listingsService } from '../services';
import toast from 'react-hot-toast';
import './HostDashboardPage.css';

export default function HostDashboardPage() {
  const { data: listings, isLoading } = useQuery({
    queryKey: ['my-listings'],
    queryFn: () => listingsService.getMyListings(),
    select: (res) => res.data.listings,
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="host-dashboard">
      <Header />
      <main className="host-dashboard__main container">
        <div className="host-dashboard__header">
          <h1 className="host-dashboard__title">Your listings</h1>
          <Link to="/host/new" className="host-dashboard__new-btn" id="create-listing-btn">
            <Plus size={16} /> Create listing
          </Link>
        </div>

        {isLoading ? (
          <div className="host-dashboard__grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="host-dashboard__skeleton">
                <div className="skeleton host-dashboard__skeleton-img" />
                <div className="skeleton host-dashboard__skeleton-line" />
              </div>
            ))}
          </div>
        ) : listings?.length === 0 ? (
          <div className="host-dashboard__empty">
            <div>🏠</div>
            <h2>No listings yet</h2>
            <p>Create your first listing to start hosting guests.</p>
            <Link to="/host/new" className="host-dashboard__new-btn">
              <Plus size={16} /> Get started
            </Link>
          </div>
        ) : (
          <div className="host-dashboard__grid">
            {listings?.map((listing) => (
              <div key={listing._id} className="host-dashboard__card">
                <div className="host-dashboard__card-img">
                  <img
                    src={listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'}
                    alt={listing.title}
                  />
                </div>
                <div className="host-dashboard__card-info">
                  <h3 className="host-dashboard__card-title">{listing.title}</h3>
                  <p className="host-dashboard__card-location">{listing.location?.city}, {listing.location?.country}</p>
                  <div className="host-dashboard__card-meta">
                    <span>{formatCurrency(listing.pricePerNight)}/night</span>
                    {listing.rating > 0 && (
                      <span className="host-dashboard__card-rating">
                        <Star size={12} fill="#222" stroke="none" /> {listing.rating.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="host-dashboard__card-actions">
                  <Link to={`/rooms/${listing._id}`} className="host-dashboard__action-btn">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
