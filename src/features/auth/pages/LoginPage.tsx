import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!email.trim()) {
      setSubmitError('Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setSubmitError('Password is required.');
      return;
    }
    try {
      await login({ email: email.trim(), password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setSubmitError(message);
    }
  };

  const loadingText = isLoading ? 'Signing in...' : 'Sign in';

  const buttonContent = isLoading ? (
    <>
      <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
      </svg>
      {loadingText}
    </>
  ) : (
    <>
      <Lock size={16} strokeWidth={1.5} />
      <span className='ml-2 text-sm font-medium'>Sign in</span>
    </>
  );

  return (
    <div className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-20 bg-gray-50'>
      <div className='w-full max-w-[384px]'>
        <div className='flex items-center gap-2 mb-8'>
          <div className='w-8 h-8 rounded flex items-center justify-center text-blue-800'>
            <Activity size={20} strokeWidth={2} />
          </div>
          <span className='font-bold text-gray-900 text-lg tracking-tight'>
            PulseMonitor
          </span>
        </div>

        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Welcome back
          </h1>
          <p className='text-sm text-gray-500'>
            Your platforms. Your company. Your workspace.
          </p>
        </div>

        {(error || submitError) && (
          <div
            className='mb-6 flex items-start gap-2 px-3 py-2 rounded bg-red-50 border border-red-100'
            role='alert'
          >
            <AlertCircle size={14} strokeWidth={1.5} className='text-red-600 shrink-0 mt-0.5' />
            <p className='text-sm text-red-700'>{error || submitError || ''}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-800 mb-2'>
              Email
            </label>
            <input
              id='email'
              type='email'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@company.com'
              className='block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none'
            />
          </div>
          <div>
            <div className='flex items-center justify-between mb-2'>
              <label htmlFor='password' className='block text-sm font-medium text-gray-800'>
                Password
              </label>
            </div>

            <div className='relative'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                autoComplete='current-password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='•••••••'
                className='block w-full pl-3 pr-12 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none pr-10'
              />
              <button
                type='button'
                aria-label='Toggle password visibility'
                className='absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={16} strokeWidth={1.5} />
                ) : (
                  <Eye size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full inline-flex items-center gap-2 justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md'
          >
            {buttonContent}
          </button>
        </form>

        <div className='mt-8 flex items-center justify-between text-sm'>
          <a
            href='/signup'
            className='font-semibold text-blue-800 hover:text-blue-700 transition-colors'
          >
            Create an account
          </a>
          <a
            href='/forgot-password'
            className='font-semibold text-blue-800 hover:text-blue-700 transition-colors'
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;