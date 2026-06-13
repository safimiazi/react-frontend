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
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] font-sans">
      <div className="bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-10 w-full max-w-md shadow-2xl">
        <h1 className="m-0 mb-7 text-2xl font-extrabold text-white text-center">Create Account</h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-slate-400">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="px-3 py-2 rounded-lg border border-[#2e2e2e] bg-[#0f0f0f] text-white text-base outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-slate-400">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              autoComplete="new-password"
              className="px-3 py-2 rounded-lg border border-[#2e2e2e] bg-[#0f0f0f] text-white text-base outline-none"
            />
            {errors.password && (
              <p role="alert" className="m-0 text-sm text-[#fca5a5]">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-400">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
              autoComplete="new-password"
              className="px-3 py-2 rounded-lg border border-[#2e2e2e] bg-[#0f0f0f] text-white text-base outline-none"
            />
            {errors.confirmPassword && (
              <p role="alert" className="m-0 text-sm text-[#fca5a5]">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.general && (
            <p role="alert" className="m-0 px-3 py-2 rounded-md bg-[#2d0b0b] border border-[#7f1d1d] text-[#fca5a5] text-sm">{errors.general}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-3 rounded-lg bg-indigo-600 text-white text-base font-semibold cursor-pointer transition ${loading ? 'opacity-70' : 'opacity-100'}`}
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">Already have an account?{' '}
          <Link to="/" className="text-indigo-400 font-medium">Log In</Link>
        </p>
      </div>
    </div>
  );
}


