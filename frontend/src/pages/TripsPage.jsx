import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { MapPin, Calendar, X } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { bookingsService } from '../services';
import toast from 'react-hot-toast';
import './TripsPage.css';

export default function TripsPage() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingsService.getMy(),
    select: (res) => res.data.bookings,
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => bookingsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-bookings']);
      toast.success('Booking cancelled');
    },
    onError: () => toast.error('Failed to cancel booking'),
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="trips-page">
      <Header />
      <main className="trips-page__main container">
        <h1 className="trips-page__title">Trips</h1>

        {isLoading ? (
          <div className="trips-page__loading">
            {[1, 2, 3].map(i => (
              <div key={i} className="trips-page__skeleton">
                <div className="skeleton trips-page__skeleton-img" />
                <div className="skeleton trips-page__skeleton-line" />
                <div className="skeleton trips-page__skeleton-line" style={{ width: '60%' }} />
              </div>
            ))}
          </div>
        ) : bookings?.length === 0 ? (
          <div className="trips-page__empty">
            <div className="trips-page__empty-icon">✈️</div>
            <h2>No trips booked…yet!</h2>
            <p>Time to dust off your bags and start planning your next adventure.</p>
          </div>
        ) : (
          <div className="trips-page__list">
            {bookings?.map((booking) => (
              <div key={booking._id} className={`trips-page__card trips-page__card--${booking.status}`}>
                <div className="trips-page__card-img">
                  <img
                    src={booking.listing?.images?.[0]?.url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'}
                    alt={booking.listing?.title}
                  />
                </div>
                <div className="trips-page__card-info">
                  <div className="trips-page__card-status trips-page__card-status--${booking.status}">
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                  <h3 className="trips-page__card-title">{booking.listing?.title}</h3>
                  <div className="trips-page__card-meta">
                    <span><MapPin size={14} /> {booking.listing?.location?.city}, {booking.listing?.location?.country}</span>
                    <span><Calendar size={14} /> {format(new Date(booking.checkIn), 'MMM d')} – {format(new Date(booking.checkOut), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="trips-page__card-price">
                    Total: <strong>{formatCurrency(booking.totalPrice)}</strong>
                  </div>
                </div>
                {booking.status === 'confirmed' && (
                  <button
                    className="trips-page__cancel-btn"
                    onClick={() => cancelMutation.mutate(booking._id)}
                    disabled={cancelMutation.isPending}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
