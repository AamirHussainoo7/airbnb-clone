import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Header from '../components/Header/Header';
import CategoryBar from '../components/CategoryBar/CategoryBar';
import ListingGrid from '../components/ListingGrid/ListingGrid';
import Footer from '../components/Footer/Footer';
import { listingsService } from '../services';
import useSearchStore from '../store/searchStore';
import './HomePage.css';

export default function HomePage() {
  const { category } = useSearchStore();

  const { data, isLoading } = useQuery({
    queryKey: ['listings', category],
    queryFn: () => listingsService.getAll(
      category !== 'all' ? { category } : {}
    ),
    select: (res) => res.data.listings,
  });

  return (
    <div className="home-page">
      <Header />
      <CategoryBar />
      <motion.main
        className="home-page__main container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ListingGrid
          listings={data || []}
          isLoading={isLoading}
          emptyMessage="Try adjusting your filters or search for a different category."
        />
      </motion.main>
      <Footer />
    </div>
  );
}
