import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllEvents, getAllUsers } from '../../services/adminService';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ users: 0, events: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const [usersResponse, eventsResponse] = await Promise.all([
          getAllUsers(token),
          getAllEvents(token)
        ]);

        if (!isMounted) {
          return;
        }

        setStats({
          users: usersResponse.count ?? usersResponse.users?.length ?? 0,
          events: eventsResponse.count ?? eventsResponse.events?.length ?? 0
        });
      } catch (loadError) {
        if (isMounted) {
          setError(loadError?.response?.data?.message || 'Unable to load admin dashboard');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (token) {
      loadDashboard();
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <section className="page-band page-band--admin">
      <div className="auth-card auth-card--wide admin-shell">
        <p className="eyebrow">Admin area</p>
        <h1>Admin Dashboard</h1>
        <p className="auth-card__text">Welcome, {user?.name}. Manage users and events from one place.</p>

        {error ? <div className="auth-message auth-message--error">{error}</div> : null}

        <div className="admin-stats">
          <article className="feature-card admin-stat">
            <p className="admin-stat__label">Total Users</p>
            <strong className="admin-stat__value">{loading ? '...' : stats.users}</strong>
          </article>
          <article className="feature-card admin-stat">
            <p className="admin-stat__label">Total Events</p>
            <strong className="admin-stat__value">{loading ? '...' : stats.events}</strong>
          </article>
        </div>

        <div className="admin-actions">
          <Link to="/admin/users" className="btn btn--primary">
            Manage Users
          </Link>
          <Link to="/admin/events" className="btn btn--ghost">
            Manage Events
          </Link>
          <Link to="/" className="btn btn--ghost">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}