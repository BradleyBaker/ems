import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '../../services/eventService';
import './ParticipantHome.css';

export default function ParticipantHome() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data.events);
      setFilteredEvents(data.events);

      // Extract unique categories
      const uniqueCategories = [...new Set(data.events.map(event => event.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.message || 'Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterEvents(term, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterEvents(searchTerm, category);
  };

  const filterEvents = (search, category) => {
    let filtered = events;

    if (category !== 'all') {
      filtered = filtered.filter(event => event.category === category);
    }

    if (search) {
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(search) ||
          event.description.toLowerCase().includes(search) ||
          event.venue.toLowerCase().includes(search)
      );
    }

    setFilteredEvents(filtered);
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

  if (loading) {
    return <div className="container loading">Loading events...</div>;
  }

  if (error) {
    return <div className="container error-message">Error: {error}</div>;
  }

  return (
    <div className="container participant-home">
      <h1>Browse Events</h1>

      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events by title, description, or venue..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-info">
        <p>Showing {filteredEvents.length} event(s)</p>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="no-events-message">
          <p>No events found matching your criteria</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <div key={event._id} className="event-card">
              <div className="event-card-header">
                <h3>{event.title}</h3>
                <span className="category-badge">{event.category}</span>
              </div>

              <div className="event-details">
                <div className="detail-item">
                  <strong>📅 Date:</strong> {formatDate(event.date)}
                </div>
                <div className="detail-item">
                  <strong>🕐 Time:</strong> {event.time}
                </div>
                <div className="detail-item">
                  <strong>📍 Venue:</strong> {event.venue}
                </div>
              </div>

              <p className="event-description">{event.description.substring(0, 100)}...</p>

              <div className="event-organizer">
                <small>by {event.organizer?.name}</small>
              </div>

              <button
                className="btn-primary"
                onClick={() => handleViewDetails(event._id)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
