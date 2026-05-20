import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UiContext';

const initialState = {
  email: '',
  password: ''
};

export default function Login() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { setLoading: setGlobalLoading, showToast } = useUI();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    setGlobalLoading(true);

    try {
      const data = await login(formData);
      showToast({ message: 'Signed in successfully', type: 'success' });
      const redirectPath = location.state?.from?.pathname;
      const defaultPath =
        data.user.role === 'admin' ? '/admin' : data.user.role === 'organizer' ? '/organizer' : '/';

      navigate(redirectPath || defaultPath, { replace: true });
    } catch (submissionError) {
      setError(submissionError.response?.data?.message || 'Login failed. Please try again.');
      showToast({ message: submissionError.response?.data?.message || 'Login failed', type: 'error' });
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <p className="auth-card__text">Sign in to access your dashboard and continue managing events.</p>

        {error ? <div className="auth-message auth-message--error">{error}</div> : null}

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
            placeholder="Enter your password"
            required
          />
        </label>

        <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="auth-card__footer">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </form>
    </section>
  );
}