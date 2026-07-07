import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Home, Star, Heart, LogOut, Settings } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { authService } from '../../services';
import './UserMenu.css';

export default function UserMenu({ onClose, onLoginClick, onRegisterClick }) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {}
    logout();
    toast.success('Logged out successfully');
    onClose();
    navigate('/');
  };

  return (
    <motion.div
      className="user-menu"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
    >
      {!isAuthenticated ? (
        <>
          <button className="user-menu__item user-menu__item--bold" onClick={onRegisterClick}>
            Sign up
          </button>
          <button className="user-menu__item" onClick={onLoginClick}>
            Log in
          </button>
          <div className="user-menu__divider" />
          <button className="user-menu__item" onClick={() => { navigate('/host/new'); onClose(); }}>
            <Home size={14} /> Airbnb your home
          </button>
          <button className="user-menu__item" onClick={onClose}>
            <Star size={14} /> Host an experience
          </button>
          <button className="user-menu__item" onClick={onClose}>
            Help Center
          </button>
        </>
      ) : (
        <>
          <div className="user-menu__user-info">
            <div className="user-menu__avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <User size={20} />
              )}
            </div>
            <div>
              <div className="user-menu__name">{user?.name}</div>
              <div className="user-menu__email">{user?.email}</div>
            </div>
          </div>
          <div className="user-menu__divider" />
          <Link className="user-menu__item" to="/trips" onClick={onClose}>
            Trips
          </Link>
          <Link className="user-menu__item" to="/wishlists" onClick={onClose}>
            <Heart size={14} /> Wishlists
          </Link>
          <div className="user-menu__divider" />
          <Link className="user-menu__item" to="/host/listings" onClick={onClose}>
            <Home size={14} /> Manage listings
          </Link>
          <Link className="user-menu__item" to="/host/new" onClick={onClose}>
            Airbnb your home
          </Link>
          <div className="user-menu__divider" />
          <button className="user-menu__item" onClick={handleLogout}>
            <LogOut size={14} /> Log out
          </button>
        </>
      )}
    </motion.div>
  );
}
