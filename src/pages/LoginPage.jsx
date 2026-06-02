import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const { token, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to /scene if already authenticated
  useEffect(() => {
    if (token) {
      navigate('/scene', { replace: true });
    }
  }, [token, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await client.post('/auth/login', { email, password });
      const accessToken = response.data.access_token;
      login(accessToken);
      navigate('/scene', { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Log In</h1>

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              style={styles.input}
            />
          </div>

          {error && (
            <p role="alert" style={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0f0f0f',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #2e2e2e',
    borderRadius: '12px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
  title: {
    margin: '0 0 1.75rem',
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#ffffff',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#a1a1a1',
  },
  input: {
    padding: '0.625rem 0.875rem',
    borderRadius: '8px',
    border: '1px solid #2e2e2e',
    background: '#0f0f0f',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  error: {
    margin: 0,
    padding: '0.625rem 0.875rem',
    borderRadius: '8px',
    background: '#2d0b0b',
    border: '1px solid #7f1d1d',
    color: '#fca5a5',
    fontSize: '0.875rem',
  },
  button: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: 'none',
    background: '#4f46e5',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s',
    marginTop: '0.25rem',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  link: {
    color: '#818cf8',
    textDecoration: 'none',
    fontWeight: 500,
  },
};
