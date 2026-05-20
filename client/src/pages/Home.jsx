import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    title: 'Plan events faster',
    text: 'Organize registrations, schedules, and communication in one clean workflow.'
  },
  {
    title: 'Ready for growth',
    text: 'The structure already separates UI, services, and reusable app state.'
  },
  {
    title: 'Backend prepared',
    text: 'Express, MongoDB, and authentication dependencies are ready for Phase 2.'
  }
];

export default function Home() {
  const { user } = useAuth();
  const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'organizer' ? '/organizer' : null;

  return (
    <section className="hero">
      <div className="hero__content">
        <p className="eyebrow">Phase 3 Organizer Features</p>
        <h1>Event Management System</h1>
        <p className="hero__text">
          A beginner-friendly MERN project with registration, login, JWT auth, role-based access
          control, and organizer event management.
        </p>

        <div className="hero__actions">
          {dashboardPath ? (
            <Link to={dashboardPath} className="btn btn--primary">
              Open dashboard
            </Link>
          ) : (
            <Link to="/register" className="btn btn--primary">
              Create account
            </Link>
          )}
          <Link to={user ? '/' : '/login'} className="btn btn--ghost">
            {user ? 'Stay on home' : 'Sign in'}
          </Link>
        </div>

        <div className="hero__status">
          <span className="status-dot" />
          {user
            ? `Welcome back, ${user.name || user.email} (${user.role})`
            : 'UI scaffold, auth, and organizer tools are ready.'}
        </div>
      </div>

      <div className="feature-grid">
        {features.map((feature) => (
          <article key={feature.title} className="feature-card">
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
