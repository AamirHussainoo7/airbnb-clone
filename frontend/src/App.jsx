import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import ListingDetailPage from './pages/ListingDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';
import TripsPage from './pages/TripsPage';
import HostDashboardPage from './pages/HostDashboardPage';
import CreateListingPage from './pages/CreateListingPage';
import WishlistPage from './pages/WishlistPage';
import ProtectedRoute from './components/UI/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#222222',
            color: '#fff',
            fontFamily: 'var(--font-family)',
            fontSize: '14px',
            padding: '12px 20px',
            borderRadius: '8px',
          },
          duration: 3000,
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rooms/:id" element={<ListingDetailPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/trips" element={
          <ProtectedRoute>
            <TripsPage />
          </ProtectedRoute>
        } />
        <Route path="/host/listings" element={
          <ProtectedRoute>
            <HostDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/host/new" element={
          <ProtectedRoute>
            <CreateListingPage />
          </ProtectedRoute>
        } />
        <Route path="/wishlists" element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
