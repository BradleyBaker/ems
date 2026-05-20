import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UiContext';
import { AUTH_ROLE_OPTIONS } from '../../utils/constants';

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'participant'
};

export default function Register() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const { setLoading: setGlobalLoading, showToast } = useUI();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setGlobalLoading(true);

    try {
      const data = await register(formData);
      showToast({ message: 'Account created', type: 'success' });
      const redirectPath = data.user.role === 'organizer' ? '/organizer' : '/';
      navigate(redirectPath, { replace: true });
    } catch (submissionError) {
      setError(submissionError.response?.data?.message || 'Registration failed. Please try again.');
      showToast({ message: submissionError.response?.data?.message || 'Registration failed', type: 'error' });
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card auth-card--wide" onSubmit={handleSubmit}>
        <p className="eyebrow">Start here</p>
        <h1>Register</h1>
        <p className="auth-card__text">Create an account as a participant or organizer. Admins are added manually.</p>

        {error ? <div className="auth-message auth-message--error">{error}</div> : null}

        <label className="field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
        </label>

        <label className="field">
          <span>Confirm Password</span>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            required
          />
        </label>

        <div className="field">
          <span>Role</span>
          <div className="auth-options" role="radiogroup" aria-label="Select role">
            {AUTH_ROLE_OPTIONS.map((option) => (
              <label key={option.value} className="auth-option">
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={formData.role === option.value}
                  onChange={handleChange}
                />
                <span className="auth-option__content">
                  <strong>{option.label}</strong>
                  <small>{option.value === 'organizer' ? 'Can create events' : 'Can register and participate'}</small>
                </span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}