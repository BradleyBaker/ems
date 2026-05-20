import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deleteEvent, getAllEvents } from '../../services/adminService';

const formatDate = (value) => {
  if (!value) {
    return 'N/A';
  }

  return new Date(value).toLocaleDateString();
};

export default function ManageEvents() {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllEvents(token);
      setEvents(data.events || []);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Unable to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadEvents();
    }
  }, [token]);

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm('Delete this event? This will also remove its registrations.');

    if (!confirmed) {
      return;
    }

    try {
      setMessage('');
      await deleteEvent(eventId, token);
      setMessage('Event deleted successfully.');
      await loadEvents();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || 'Unable to delete event');
    }
  };

  return (
    <section className="page-band page-band--admin">
      <div className="auth-card auth-card--wide admin-shell">
        <div className="toolbar toolbar--space-between">
          <div>
            <p className="eyebrow">Admin area</p>
            <h1>Manage Events</h1>
            <p className="auth-card__text">Review events, organizers, and remove any event if needed.</p>
          </div>
          <Link to="/admin" className="btn btn--ghost">
            Back to Dashboard
          </Link>
        </div>

        {error ? <div className="auth-message auth-message--error">{error}</div> : null}
        {message ? <div className="auth-message auth-message--success">{message}</div> : null}

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <h2>No events found</h2>
            <p>There are no events to display right now.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table admin-table--events">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Organizer</th>
                  <th>Venue</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.organizer?.name || 'Unknown organizer'}</td>
                    <td>{item.venue}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--danger"
                        onClick={() => handleDelete(item._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}