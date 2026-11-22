import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, isAuthenticated, error } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<'company' | 'individual'>('individual');
  const [companyName, setCompanyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/clients', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const isCompany = accountType === 'company';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setSubmitError('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setSubmitError('Email is required.');
      return;
    }
    if (!/^[^\\s@]+@[^\\s@]+\.[^\\s@]+$/.test(email)) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setSubmitError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setSubmitError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setSubmitError('Passwords do not match.');
      return;
    }
    if (isCompany && !companyName.trim()) {
      setSubmitError('Company name is required.');
      return;
    }

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        accountType,
        companyName: isCompany ? companyName.trim() : undefined,
      });
      navigate('/clients', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setSubmitError(message);
    }
  };
return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-20">
      <div className="w-full max-w-[384px] mt-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded flex items-center justify-center text-blue-800">
            <Activity size={20} strokeWidth={2} />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            PulseMonitor
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-sm text-gray-500">
            Start monitoring your platforms and managing your workspace.
          </p>
        </div>

        {(error || submitError) && (
          <div className="mb-6 flex items-start gap-2 px-3 py-2 rounded bg-red-50 border border-red-100" role="alert">
            <AlertCircle size={14} strokeWidth={1.5} className="text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error || submitError || ''}</p>
          </div>
        )}
<form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-800 mb-3">
              Full name
            </label>
            <input
              id="full-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
              Password
            </label>
            <div className="flex">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff size={16} strokeWidth={1.5} />
              ) : (
                <Eye size={16} strokeWidth={1.5} />
              )}
            </button>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-800">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Account type
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="account-type"
                  value="individual"
                  checked={accountType === 'individual'}
                  onChange={() => setAccountType('individual')}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Individual</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="account-type"
                  value="company"
                  checked={accountType === 'company'}
                  onChange={() => setAccountType('company')}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Company</span>
              </label>
            </div>
          </div>

          {isCompany && (
            <div>
              <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-2">
                Company name
              </label>
              <input
                id="company-name"
                type="text"
                autoComplete="organization"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Corporation"
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center gap-2 justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </>
            ) : (
              <span>Create account</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-bold text-blue-500">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-bold text-blue-500 hover:text-blue-800 transition-colors"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;