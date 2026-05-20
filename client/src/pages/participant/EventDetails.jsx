import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEventById } from '../../services/eventService';
import { registerForEvent, checkIfRegistered } from '../../services/registrationService';
import './EventDetails.css';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    if (user && user.role === 'participant') {
      checkRegistrationStatus();
    }
  }, [user, event]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await getEventById(id);
      setEvent(data.event);
    } catch (err) {
      setError(err.message || 'Failed to load event details');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    if (!token) return;
    try {
      const data = await checkIfRegistered(id, token);
      setIsRegistered(data.isRegistered);
    } catch (err) {
      console.error('Error checking registration status:', err);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'participant') {
      setRegistrationMessage('Only participants can register for events');
      return;
    }

    try {
      setRegistering(true);
      await registerForEvent(id, token);
      setIsRegistered(true);
      setRegistrationMessage('Successfully registered for the event!');
      setTimeout(() => setRegistrationMessage(''), 3000);
    } catch (err) {
      setRegistrationMessage(err.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="container loading">Loading event details...</div>;
  }

  if (error) {
    return <div className="container error-message">Error: {error}</div>;
  }

  if (!event) {
    return <div className="container error-message">Event not found</div>;
  }

  return (
    <div className="container event-details-page">
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Back to Events
      </button>

      <div className="event-details-container">
        <div className="event-header">
          <h1>{event.title}</h1>
          <span className="event-category">{event.category}</span>
        </div>

        {event.image && (
          <div className="event-image">
            <img src={event.image} alt={event.title} />
          </div>
        )}

        <div className="event-info-grid">
          <div className="info-card">
            <h3>📅 Date</h3>
            <p>{formatDate(event.date)}</p>
          </div>

          <div className="info-card">
            <h3>🕐 Time</h3>
            <p>{event.time}</p>
          </div>

          <div className="info-card">
            <h3>📍 Venue</h3>
            <p>{event.venue}</p>
          </div>

          <div className="info-card">
            <h3>👤 Organizer</h3>
            <p>{event.organizer?.name}</p>
            <small>{event.organizer?.email}</small>
          </div>
        </div>

        <div className="event-description-section">
          <h2>About This Event</h2>
          <p>{event.description}</p>
        </div>

        <div className="registration-section">
          {registrationMessage && (
            <div className={`message ${isRegistered ? 'success' : 'error'}`}>
              {registrationMessage}
            </div>
          )}

          {isRegistered ? (
            <div className="already-registered">
              <p>✓ You are already registered for this event</p>
              <button
                className="btn-secondary"
                onClick={() => navigate('/registered-events')}
              >
                View My Registered Events
              </button>
            </div>
          ) : (
            <button
              className="btn-register"
              onClick={handleRegister}
              disabled={registering || !user || user.role !== 'participant'}
            >
              {registering ? 'Registering...' : 'Register for Event'}
            </button>
          )}

          {!user && (
            <p className="login-prompt">
              Please <a href="/login">log in</a> to register for this event
            </p>
          )}

          {user && user.role !== 'participant' && (
            <p className="role-prompt">
              Only participants can register for events
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
