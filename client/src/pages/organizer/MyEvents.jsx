import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deleteEvent, getMyEvents } from '../../services/eventService';

export default function MyEvents() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEvents = async () => {
    try {
      const data = await getMyEvents(token);
      setEvents(data.events || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load your events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [token]);

  const handleDelete = async (eventId) => {
    const shouldDelete = window.confirm('Delete this event? This action cannot be undone.');

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteEvent(eventId, token);
      setEvents((current) => current.filter((event) => event._id !== eventId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete this event.');
    }
  };

  if (loading) {
    return (
      <section className="page-band">
        <div className="auth-card">Loading your events...</div>
      </section>
    );
  }

  return (
    <section className="page-band">
      <div className="auth-card auth-card--wide organizer-panel">
        <div className="toolbar toolbar--space-between">
          <div>
            <p className="eyebrow">Organizer area</p>
            <h1>My Events</h1>
            <p className="auth-card__text">Review, edit, or delete the events you created.</p>
          </div>
          <Link to="/organizer/events/new" className="btn btn--primary">
            Create Event
          </Link>
        </div>

        {error ? <div className="auth-message auth-message--error">{error}</div> : null}

        {events.length ? (
          <div className="event-grid">
            {events.map((event) => (
              <article key={event._id} className="event-card">
                {event.image ? <img src={event.image} alt={event.title} className="event-card__image" /> : null}
                <div className="event-card__body">
                  <p className="event-card__tag">{event.category}</p>
                  <h2>{event.title}</h2>
                  <p className="event-card__meta">Venue: {event.venue}</p>
                  <p className="event-card__meta">
                    Date: {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                  </p>

                  <div className="toolbar">
                    <Link to={`/organizer/events/${event._id}/edit`} state={{ event }} className="btn btn--ghost">
                      Edit
                    </Link>
                    <button type="button" onClick={() => handleDelete(event._id)} className="btn btn--danger">
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No events yet</h2>
            <p>Create your first event to see it listed here.</p>
            <button type="button" className="btn btn--primary" onClick={() => navigate('/organizer/events/new')}>
              Create Event
            </button>
          </div>
        )}
      </div>
    </section>
  );
}