import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { deleteUser, getAllUsers } from '../../services/adminService';

export default function ManageUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllUsers(token);
      setUsers(data.users || []);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token]);

  const handleDelete = async (userId) => {
    const confirmed = window.confirm('Delete this user? This may also remove their events and registrations.');

    if (!confirmed) {
      return;
    }

    try {
      setMessage('');
      await deleteUser(userId, token);
      setMessage('User deleted successfully.');
      await loadUsers();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || 'Unable to delete user');
    }
  };

  return (
    <section className="page-band page-band--admin">
      <div className="auth-card auth-card--wide admin-shell">
        <div className="toolbar toolbar--space-between">
          <div>
            <p className="eyebrow">Admin area</p>
            <h1>Manage Users</h1>
            <p className="auth-card__text">View and remove users from the system.</p>
          </div>
          <Link to="/admin" className="btn btn--ghost">
            Back to Dashboard
          </Link>
        </div>

        {error ? <div className="auth-message auth-message--error">{error}</div> : null}
        {message ? <div className="auth-message auth-message--success">{message}</div> : null}

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <h2>No users found</h2>
            <p>There are no users to display right now.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>
                      <span className="role-pill">{item.role}</span>
                    </td>
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