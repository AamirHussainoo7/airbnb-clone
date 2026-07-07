import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { authService } from '../../services';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import './AuthModal.css';

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const isLogin = mode === 'login';

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = isLogin
        ? await authService.login({ email: form.email, password: form.password })
        : await authService.register(form);
      setUser(data.user, data.token);
      toast.success(isLogin ? 'Welcome back! 👋' : 'Account created! 🎉');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="auth-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="auth-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isLogin ? 'Login' : 'Register'}
      >
        {/* Header */}
        <div className="auth-modal__header">
          <button className="auth-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
          <h2 className="auth-modal__title">
            {isLogin ? 'Log in' : 'Sign up'}
          </h2>
        </div>

        <div className="auth-modal__body">
          <h3 className="auth-modal__subtitle">Welcome to Airbnb</h3>

          <form className="auth-modal__form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="auth-modal__field">
                <label htmlFor="auth-name">Name</label>
                <input
                  id="auth-name"
                  type="text"
                  name="name"
                  placeholder="First and last name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="auth-modal__field">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-modal__field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                name="password"
                placeholder={isLogin ? 'Password' : 'Create a password (min 6 chars)'}
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            {error && <div className="auth-modal__error">{error}</div>}

            <button
              type="submit"
              className="auth-modal__submit"
              disabled={loading}
              id={isLogin ? 'login-submit-btn' : 'register-submit-btn'}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Continue' : 'Agree and continue')}
            </button>
          </form>

          <div className="auth-modal__switch">
            {isLogin ? (
              <>
                Don&apos;t have an account?{' '}
                <button onClick={() => onSwitch('register')}>Sign up</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => onSwitch('login')}>Log in</button>
              </>
            )}
          </div>

          <div className="auth-modal__divider"><span>or</span></div>
          <p className="auth-modal__demo">
            <strong>Demo:</strong> guest@airbnb-clone.com / password123
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
