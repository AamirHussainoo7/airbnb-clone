import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { DateRange } from 'react-date-range';
import { Search, MapPin, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useSearchStore from '../../store/searchStore';
import GuestPicker from '../GuestPicker/GuestPicker';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './SearchModal.css';

const POPULAR_DESTINATIONS = [
  { label: "I'm flexible", icon: '🌍' },
  { label: 'Goa', icon: '🏖️' },
  { label: 'Manali', icon: '🏔️' },
  { label: 'Jaipur', icon: '🏰' },
  { label: 'Kerala', icon: '🌴' },
  { label: 'Maldives', icon: '🐠' },
];

export default function SearchModal({ onClose }) {
  const navigate = useNavigate();
  const {
    location, setLocation,
    checkIn, checkOut, setDates,
    guests,
    activeTab, setActiveTab,
  } = useSearchStore();

  const [dateRange, setDateRange] = useState([{
    startDate: checkIn || new Date(),
    endDate: checkOut || addDays(new Date(), 3),
    key: 'selection',
  }]);

  const totalGuests = guests.adults + guests.children;

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
    setDates(ranges.selection.startDate, ranges.selection.endDate);
    if (ranges.selection.startDate && ranges.selection.endDate &&
      ranges.selection.startDate.toDateString() !== ranges.selection.endDate.toDateString()) {
      setActiveTab('guests');
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkIn', checkIn.toISOString());
    if (checkOut) params.set('checkOut', checkOut.toISOString());
    if (totalGuests > 0) params.set('guests', totalGuests.toString());
    navigate(`/search?${params.toString()}`);
    onClose();
  };

  const formatDate = (date) => date ? format(date, 'MMM d') : '';

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="search-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="search-modal"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {/* Tabs */}
        <div className="search-modal__tabs">
          <button
            className={`search-modal__tab ${activeTab === 'stays' ? 'active' : ''}`}
            onClick={() => setActiveTab('stays')}
          >Stays</button>
          <button
            className={`search-modal__tab ${activeTab === 'experiences' ? 'active' : ''}`}
            onClick={() => setActiveTab('experiences')}
          >Experiences</button>
        </div>

        {/* Search Bar */}
        <div className="search-modal__bar">
          {/* Location */}
          <div
            className={`search-modal__section search-modal__section--location ${activeTab === 'location' ? 'active' : ''}`}
            onClick={() => setActiveTab('location')}
          >
            <label className="search-modal__label">Where</label>
            <input
              className="search-modal__input"
              placeholder="Search destinations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              autoFocus={activeTab === 'location'}
            />
          </div>

          <div className="search-modal__divider" />

          {/* Check-in */}
          <div
            className={`search-modal__section ${activeTab === 'dates' ? 'active' : ''}`}
            onClick={() => setActiveTab('dates')}
          >
            <label className="search-modal__label">Check in</label>
            <span className="search-modal__value">
              {checkIn ? formatDate(checkIn) : 'Add dates'}
            </span>
          </div>

          <div className="search-modal__divider" />

          {/* Check-out */}
          <div
            className={`search-modal__section ${activeTab === 'dates' ? 'active' : ''}`}
            onClick={() => setActiveTab('dates')}
          >
            <label className="search-modal__label">Check out</label>
            <span className="search-modal__value">
              {checkOut ? formatDate(checkOut) : 'Add dates'}
            </span>
          </div>

          <div className="search-modal__divider" />

          {/* Guests */}
          <div
            className={`search-modal__section search-modal__section--guests ${activeTab === 'guests' ? 'active' : ''}`}
            onClick={() => setActiveTab('guests')}
          >
            <label className="search-modal__label">Who</label>
            <span className="search-modal__value">
              {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}
            </span>
          </div>

          {/* Search Button */}
          <button className="search-modal__submit" onClick={handleSearch} id="search-submit-btn">
            <Search size={18} strokeWidth={2.5} />
            <span>Search</span>
          </button>
        </div>

        {/* Panel Content */}
        <div className="search-modal__panel">
          {activeTab === 'location' && (
            <div className="search-modal__destinations">
              <h3 className="search-modal__panel-title">Popular destinations</h3>
              <div className="search-modal__dest-grid">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.label}
                    className="search-modal__dest-btn"
                    onClick={() => {
                      setLocation(dest.label === "I'm flexible" ? '' : dest.label);
                      setActiveTab('dates');
                    }}
                  >
                    <span className="search-modal__dest-icon">{dest.icon}</span>
                    <span>{dest.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'dates' && (
            <div className="search-modal__calendar">
              <DateRange
                ranges={dateRange}
                onChange={handleDateChange}
                months={2}
                direction="horizontal"
                showDateDisplay={false}
                minDate={new Date()}
                rangeColors={['#FF385C']}
                showMonthAndYearPickers={false}
              />
            </div>
          )}

          {activeTab === 'guests' && (
            <GuestPicker />
          )}
        </div>
      </motion.div>
    </>
  );
}
