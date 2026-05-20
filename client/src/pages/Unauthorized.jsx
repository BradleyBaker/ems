import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Access denied</p>
        <h1>Unauthorized</h1>
        <p className="auth-card__text">Your account does not have permission to open this page.</p>
        <Link to="/" className="btn btn--primary btn--full">
          Return home
        </Link>
      </div>
    </section>
  );
}