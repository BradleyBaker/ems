import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createEvent } from '../../services/eventService';

const initialState = {
  title: '',
  description: '',
  category: '',
  date: '',
  time: '',
  venue: '',
  image: ''
};

export default function CreateEvent() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createEvent(formData, token);
      navigate('/organizer/events');
    } catch (submissionError) {
      setError(submissionError.response?.data?.message || 'Could not create the event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-band">
      <form className="auth-card auth-card--wide organizer-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Organizer tools</p>
        <h1>Create Event</h1>
        <p className="auth-card__text">Fill in the details below to publish a new event.</p>

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
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/organizer')}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}