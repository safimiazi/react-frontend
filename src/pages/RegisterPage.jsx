import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import useAuth from '../hooks/useAuth';

export default function RegisterPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect to /scene if already authenticated
  useEffect(() => {
    if (token) {
      navigate('/scene', { replace: true });
    }
  }, [token, navigate]);

  function validate() {
    const newErrors = {};

    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Client-side validation before any network call
    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await client.post('/auth/register', { email, password });
      // 201 Created — navigate to login
      navigate('/', { replace: true });
    } catch (err) {
      const status = err.response?.status;

      if (status === 409) {
        setErrors({ general: 'Email already registered.' });
      } else if (status === 400) {
        // Surface field-level validation errors from the API
        const apiMessage = err.response?.data?.message;
        if (Array.isArray(apiMessage)) {
          setErrors({ general: apiMessage.join(' ') });
        } else {
          setErrors({ general: apiMessage || 'Invalid input. Please check your details.' });
        }
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>

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
              placeholder="At least 8 characters"
              required
              autoComplete="new-password"
              style={styles.input}
            />
            {errors.password && (
              <p role="alert" style={styles.fieldError}>
                {errors.password}
              </p>
            )}
          </div>

          <div style={styles.field}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
              autoComplete="new-password"
              style={styles.input}
            />
            {errors.confirmPassword && (
              <p role="alert" style={styles.fieldError}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.general && (
            <p role="alert" style={styles.error}>
              {errors.general}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/" style={styles.link}>
            Log In
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
  fieldError: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#fca5a5',
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
