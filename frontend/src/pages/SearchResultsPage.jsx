import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import CategoryBar from '../components/CategoryBar/CategoryBar';
import ListingGrid from '../components/ListingGrid/ListingGrid';
import Footer from '../components/Footer/Footer';
import { listingsService } from '../services';
import './SearchResultsPage.css';

export default function SearchResultsPage() {
  const [params] = useSearchParams();
  const location = params.get('location') || '';
  const guests = params.get('guests') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', location, guests],
    queryFn: () => listingsService.getAll({ location, guests }),
    select: (res) => res.data,
  });

  const listings = data?.listings || [];
  const total = data?.pagination?.total || 0;

  return (
    <div className="search-results-page">
      <Header />
      <CategoryBar />
      <main className="search-results-page__main container">
        {!isLoading && (
          <div className="search-results-page__header">
            <h1 className="search-results-page__title">
              {total > 0 ? `${total}+ stays${location ? ` in ${location}` : ''}` : 'No results found'}
            </h1>
          </div>
        )}
        <ListingGrid
          listings={listings}
          isLoading={isLoading}
          emptyMessage={`No listings found${location ? ` in ${location}` : ''}. Try a different destination.`}
        />
      </main>
      <Footer />
    </div>
  );
}
