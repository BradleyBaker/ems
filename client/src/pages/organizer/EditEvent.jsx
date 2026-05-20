import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyEvents, updateEvent } from '../../services/eventService';

const emptyEvent = {
  title: '',
  description: '',
  category: '',
  date: '',
  time: '',
  venue: '',
  image: ''
};

export default function EditEvent() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyEvent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await getMyEvents(token);
        const event = data.events.find((item) => item._id === id);

        if (!event) {
          setError('Event not found.');
          return;
        }

        setFormData({
          title: event.title || '',
          description: event.description || '',
          category: event.category || '',
          date: event.date ? new Date(event.date).toISOString().slice(0, 10) : '',
          time: event.time || '',
          venue: event.venue || '',
          image: event.image || ''
        });
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load this event.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await updateEvent(id, formData, token);
      navigate('/organizer/events');
    } catch (submissionError) {
      setError(submissionError.response?.data?.message || 'Could not update the event.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="page-band">
        <div className="auth-card">Loading event...</div>
      </section>
    );
  }

  if (error && !formData.title) {
    return (
      <section className="page-band">
        <div className="auth-card">
          <p className="eyebrow">Organizer tools</p>
          <h1>Edit Event</h1>
          <div className="auth-message auth-message--error">{error}</div>
          <button type="button" className="btn btn--primary btn--full" onClick={() => navigate('/organizer/events')}>
            Back to My Events
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-band">
      <form className="auth-card auth-card--wide organizer-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Organizer tools</p>
        <h1>Edit Event</h1>
        <p className="auth-card__text">Update the information for your event.</p>

        {error ? <div className="auth-message auth-message--error">{error}</div> : null}

        <div className="form-grid">
          <label className="field">
            <span>Title</span>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Category</span>
            <input name="category" value={formData.category} onChange={handleChange} required />
          </label>

          <label className="field field--full">
            <span>Description</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </label>

          <label className="field">
            <span>Date</span>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Time</span>
            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          </label>

          <label className="field field--full">
            <span>Venue</span>
            <input name="venue" value={formData.venue} onChange={handleChange} required />
          </label>

          <label className="field field--full">
            <span>Image URL (optional)</span>
            <input name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
          </label>
        </div>

        <div className="toolbar">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving...' : 'Update Event'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/organizer/events')}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}