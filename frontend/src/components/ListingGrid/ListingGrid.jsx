import ListingCard from '../ListingCard/ListingCard';
import './ListingGrid.css';

// Skeleton card for loading
function SkeletonCard() {
  return (
    <div className="listing-grid__skeleton">
      <div className="skeleton listing-grid__skeleton-img" />
      <div className="listing-grid__skeleton-info">
        <div className="skeleton listing-grid__skeleton-line" style={{ width: '70%' }} />
        <div className="skeleton listing-grid__skeleton-line" style={{ width: '50%', height: '12px' }} />
        <div className="skeleton listing-grid__skeleton-line" style={{ width: '40%', height: '12px' }} />
        <div className="skeleton listing-grid__skeleton-line" style={{ width: '60%' }} />
      </div>
    </div>
  );
}

export default function ListingGrid({ listings = [], isLoading = false, emptyMessage = 'No listings found' }) {
  if (isLoading) {
    return (
      <div className="listing-grid">
        {Array.from({ length: 16 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!listings.length) {
    return (
      <div className="listing-grid__empty">
        <div className="listing-grid__empty-icon">🏠</div>
        <h3>No exact matches</h3>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="listing-grid">
      {listings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} />
      ))}
    </div>
  );
}
