import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const organizerStats = [
  {
    title: 'Create events',
    text: 'Add new events with title, date, venue, and an optional image.'
  },
  {
    title: 'Update quickly',
    text: 'Edit only the events you created. Ownership is checked on the server.'
  },
  {
    title: 'Manage safely',
    text: 'Protected routes ensure only organizers can access these pages.'
  }
];

export default function OrganizerDashboard() {
  const { user } = useAuth();

  return (
    <section className="page-band">
      <div className="auth-card dashboard-card organizer-panel">
        <div className="header-row">
          <div>
            <p className="eyebrow">Organizer area</p>
            <h1>Organizer Dashboard</h1>
            <p className="auth-card__text">Welcome, {user?.name}. Manage your events from one place.</p>
          </div>

          <div className="toolbar">
            <Link to="/organizer/events/new" className="btn btn--primary">
              Create Event
            </Link>
            <Link to="/organizer/events" className="btn btn--ghost">
              View My Events
            </Link>
          </div>
        </div>

        <div className="dashboard-grid dashboard-grid--events">
          {organizerStats.map((item) => (
            <article key={item.title} className="feature-card organizer-stat">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="footer-row">
          <div className="hero__actions">
            <Link to="/" className="btn btn--ghost">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}