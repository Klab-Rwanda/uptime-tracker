import { useNavigate } from 'react-router-dom';
import { Activity, Mail, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-20">
      <div className="w-full max-w-[384px]">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded flex items-center justify-center text-blue-800">
            <Activity size={20} strokeWidth={2} />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            PulseMonitor
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Forgot password
          </h1>
          <p className="text-sm text-gray-500">
            Password recovery is not yet configured on the backend. Please contact your workspace administrator.
          </p>
        </div>

        <div className="mb-6 flex items-start gap-2 px-3 py-2 rounded bg-amber-50 border border-amber-100">
          <AlertCircle size={14} strokeWidth={1.5} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            No password reset endpoint is available. This feature requires backend integration.
          </p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            <Mail size={14} strokeWidth={1.5} />
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
};