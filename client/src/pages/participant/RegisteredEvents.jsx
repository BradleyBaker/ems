import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyRegistrations } from '../../services/registrationService';
import './RegisteredEvents.css';

export default function RegisteredEvents() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !user || user.role !== 'participant') {
      navigate('/');
      return;
    }
    fetchRegisteredEvents();
  }, [token, user, navigate]);

  const fetchRegisteredEvents = async () => {
    try {
      setLoading(true);
      const data = await getMyRegistrations(token);
      setRegistrations(data.registrations);
    } catch (err) {
      setError(err.message || 'Failed to load registered events');
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return <div className="container loading">Loading your registrations...</div>;
  }

  if (error) {
    return <div className="container error-message">Error: {error}</div>;
  }

  return (
    <div className="container registered-events-page">
      <div className="page-header">
        <h1>My Registered Events</h1>
        <button className="btn-browse" onClick={() => navigate('/')}>
          Browse More Events
        </button>
      </div>

      {registrations.length === 0 ? (
        <div className="no-registrations">
          <p>You haven't registered for any events yet.</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/')}
          >
            Explore Events
          </button>
        </div>
      ) : (
        <>
          <div className="registrations-count">
            <p>You are registered for <strong>{registrations.length}</strong> event(s)</p>
          </div>

          <div className="registrations-list">
            {registrations.map(registration => (
              <div key={registration._id} className="registration-item">
                <div className="registration-left">
                  <h3>{registration.event.title}</h3>
                  <div className="event-meta">
                    <span className="category-badge">{registration.event.category}</span>
                  </div>

                  <div className="event-info">
                    <div className="info-row">
                      <span className="label">📅 Date:</span>
                      <span className="value">{formatDate(registration.event.date)}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">🕐 Time:</span>
                      <span className="value">{formatTime(registration.event.time)}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">📍 Venue:</span>
                      <span className="value">{registration.event.venue}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">👤 Organizer:</span>
                      <span className="value">{registration.event.organizer?.name}</span>
                    </div>
                  </div>

                  <div className="registration-date">
                    <small>Registered on: {formatDate(registration.registrationDate)}</small>
                  </div>
                </div>

                <div className="registration-right">
                  <button
                    className="btn-view-details"
                    onClick={() => handleViewDetails(registration.event._id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
