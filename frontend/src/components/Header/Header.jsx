import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Globe, Menu, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useSearchStore from '../../store/searchStore';
import SearchModal from './SearchModal';
import UserMenu from './UserMenu';
import AuthModal from '../Auth/AuthModal';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
  const { isAuthenticated, user } = useAuthStore();
  const { isSearchModalOpen, openSearchModal, closeSearchModal } = useSearchStore();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header__inner">
          {/* Logo */}
          <Link to="/" className="header__logo" aria-label="Airbnb home">
            <svg viewBox="0 0 32 32" className="header__logo-svg" aria-hidden="true">
              <path
                d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179v.185l-.014.324c-.05.49-.191.9-.436 1.181l-.187.194-.212.193c-.654.57-1.488.866-2.441.866-1.07 0-2.116-.421-3.073-1.163l-.208-.17-.191-.164a5.15 5.15 0 0 1-.172-.154l-.174-.173-1.006-.927-.009-.001c-2.2 2.11-4.4 3.167-6.491 3.167-3.47 0-6.347-2.416-6.347-6.478v-.175c.012-1.064.227-2.014.748-3.306l.278-.662.121-.285c.983-2.297 5.236-11.12 7.163-14.893l.489-.94C12.53 1.963 13.986 1 16 1zm0 2c-1.239 0-2.053.539-3.048 2.421l-.527 1.017c-1.966 3.85-6.177 12.65-7.16 14.944l-.145.353-.122.295c-.432 1.071-.62 1.759-.635 2.623l-.007.289v.165c0 2.917 1.97 4.478 4.347 4.478 1.709 0 3.646-.93 5.604-2.7l.226-.213.244-.237-1.067-1.177c-1.517-1.72-2.374-3.376-2.374-4.73 0-2.215 1.515-3.702 3.573-3.702 2.02 0 3.573 1.431 3.573 3.702 0 1.354-.857 3.01-2.374 4.73l-1.006 1.107.257.252c2.1 2.012 4.2 3.068 6.201 3.068 2.377 0 4.357-1.56 4.357-4.478 0-.16-.007-.325-.02-.498l-.036-.327-.084-.449c-.162-.666-.427-1.384-.88-2.354l-.176-.372c-.977-2.295-5.178-11.094-7.127-14.893l-.533-1.025C18.053 3.539 17.239 3 16 3zm0 11.427c1.004 0 1.573.619 1.573 1.702 0 .709-.569 1.99-1.573 3.281-1.004-1.29-1.573-2.572-1.573-3.281 0-1.083.568-1.702 1.573-1.702z"
                fill="#FF385C"
              />
            </svg>
            <span className="header__logo-text">airbnb</span>
          </Link>

          {/* Compact Search Bar */}
          <motion.button
            className={`header__search-pill ${scrolled || !isSearchModalOpen ? '' : 'header__search-pill--hidden'}`}
            onClick={() => openSearchModal('location')}
            id="header-search-btn"
            aria-label="Search"
          >
            <span className="header__search-pill-text">Anywhere</span>
            <span className="header__search-pill-divider" aria-hidden="true" />
            <span className="header__search-pill-text">Any week</span>
            <span className="header__search-pill-divider" aria-hidden="true" />
            <span className="header__search-pill-text header__search-pill-text--gray">Add guests</span>
            <span className="header__search-pill-icon">
              <Search size={16} strokeWidth={2.5} />
            </span>
          </motion.button>

          {/* Right Side */}
          <div className="header__right">
            <Link to="/host/new" className="header__host-link">
              Airbnb your home
            </Link>
            <button className="header__globe-btn" aria-label="Choose a language">
              <Globe size={18} />
            </button>
            <div className="header__user-menu-wrapper" ref={userMenuRef}>
              <button
                className="header__user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                id="user-menu-btn"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <Menu size={18} />
                <div className="header__user-avatar">
                  {isAuthenticated && user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <User size={22} />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <UserMenu
                    onClose={() => setShowUserMenu(false)}
                    onLoginClick={() => { setShowUserMenu(false); setAuthModal('login'); }}
                    onRegisterClick={() => { setShowUserMenu(false); setAuthModal('register'); }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchModalOpen && <SearchModal onClose={closeSearchModal} />}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {authModal && (
          <AuthModal
            mode={authModal}
            onClose={() => setAuthModal(null)}
            onSwitch={(mode) => setAuthModal(mode)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
