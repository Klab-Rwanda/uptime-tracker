import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertCircle, Mail } from 'lucide-react';
import { authService } from '../services/authService';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!codeSent) {
        await authService.requestPasswordReset(email.trim());
        setCodeSent(true);
      } else {
        if (!/^\d{6}$/.test(code)) {
          throw new Error('Enter the 6-digit code from your email.');
        }
        await authService.resetPassword(email.trim(), code, newPassword);
        setComplete(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password recovery failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 pb-20 sm:px-6 lg:px-8">
      <div className="w-full max-w-[384px]">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded text-indigo-600">
            <Activity size={20} strokeWidth={2} />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">PulseMonitor</span>
        </div>

        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-gray-900">
            {complete ? 'Password updated' : 'Forgot password'}
          </h1>
          <p className="text-sm text-gray-500">
            {complete
              ? 'Your password has been reset. You can sign in with your new password.'
              : codeSent
                ? 'Enter the 6-digit code sent to your email and choose a new password.'
                : 'We’ll send a password reset code to your email address.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded border border-red-100 bg-red-50 px-3 py-2" role="alert">
            <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {codeSent && !complete && (
          <div className="mb-5 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800" role="status">
            If an account exists for this address, a reset code has been sent.
          </div>
        )}

        {!complete && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={codeSent}
                placeholder="you@company.com"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
              />
            </div>

            {codeSent && (
              <>
                <div>
                  <label htmlFor="code" className="mb-2 block text-sm font-medium text-gray-800">
                    Reset code
                  </label>
                  <input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
                    placeholder="6-digit code"
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-gray-800">
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={12}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">Use at least 12 characters.</p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Mail size={15} />
              {loading ? 'Please wait…' : codeSent ? 'Reset password' : 'Send reset code'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-500"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
