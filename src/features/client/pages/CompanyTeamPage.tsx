import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Mail,
  UserPlus,
  Shield,
  Crown,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { formatDate } from '../utils/client.utils';
export type AccessLevel = 'Viewer' | 'Operator' | 'Administrator';

interface ActiveMember {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface PendingInvite {
  id: string;
  email: string;
  accessLevel: AccessLevel;
  invitedAt: string;
  status: 'pending' | 'accepted' | 'cancelled';
}

const ROLE_DESCRIPTIONS: Record<AccessLevel, string> = {
  Viewer:
    'Read platforms, logs, incidents, and notifications. Cannot create, edit, or delete platforms. Cannot manage company settings or team members.',
  Operator:
    'Viewer access plus platform management and incident actions. Cannot manage team members. Cannot change owner-level company settings.',
  Administrator:
    'Operator access plus company settings. Cannot add or remove team members unless explicitly allowed. Cannot change the workspace owner.',
};

const ACCESS_LEVEL_ORDER: AccessLevel[] = ['Viewer', 'Operator', 'Administrator'];

const ROLE_COLORS: Record<AccessLevel, string> = {
  Viewer: 'bg-gray-100 text-gray-800',
  Operator: 'bg-blue-100 text-blue-800',
  Administrator: 'bg-purple-100 text-purple-800',
};

const ROLE_BADGE_CLASSES: Record<AccessLevel, string> = {
  Viewer: 'bg-gray-100 text-gray-800',
  Operator: 'bg-blue-100 text-blue-800',
  Administrator: 'bg-purple-100 text-purple-800',
};

const MOCK_ACTIVE_MEMBERS: ActiveMember[] = [
  { id: 'm1', email: 'owner@example.com', name: 'Alex Owner', role: 'Workspace owner' },
  { id: 'm2', email: 'subadmin1@example.com', name: 'Sam Subadmin', role: 'Administrator' },
  { id: 'm3', email: 'viewer1@example.com', name: 'Taylor Viewer', role: 'Viewer' },
];

const MOCK_PENDING_INVITES: PendingInvite[] = [
  {
    id: 'p1',
    email: 'newmember@example.com',
    accessLevel: 'Operator',
    invitedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'pending',
  },
  {
    id: 'p2',
    email: 'invitee2@example.com',
    accessLevel: 'Viewer',
    invitedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'pending',
  },
];

const DEFAULT_COMPANY_NAME = 'PulseMonitor Workspace';

export const CompanyTeamPage = () => {
  const navigate = useNavigate();

  const [companyName] = useState(DEFAULT_COMPANY_NAME);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeMembers, setActiveMembers] = useState<ActiveMember[]>(MOCK_ACTIVE_MEMBERS);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>(MOCK_PENDING_INVITES);

  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('Viewer');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setActiveMembers(MOCK_ACTIVE_MEMBERS);
      setPendingInvites(MOCK_PENDING_INVITES);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const isValidEmail = (value: string): boolean => {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const hasDuplicateEmail = (targetEmail: string): boolean => {
    return activeMembers.some(
      (member) => member.email.toLowerCase() === targetEmail.toLowerCase(),
    );
  };

  const handleAddSubadmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setSubmitSuccess(null);

    if (!email.trim()) {
      setEmailError('Email is required.');
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (hasDuplicateEmail(email.trim().toLowerCase())) {
      setInviteError('This email is already a member of the company team.');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPendingInvites((prev) => [
        ...prev,
        {
          id: `invite_${Date.now()}`,
          email: email.trim().toLowerCase(),
          accessLevel,
          invitedAt: new Date().toISOString(),
          status: 'pending',
        },
      ]);
      setEmail('');
      setAccessLevel('Viewer');
      setSubmitSuccess(`Subadmin invitation created for ${email.trim()}. Pending acceptance.`);
    } catch (err) {
      console.error('Failed to add subadmin:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelInvite = (id: string) => {
    setPendingInvites((prev) =>
      prev.map((invite) =>
        invite.id === id ? { ...invite, status: 'cancelled' } : invite,
      ),
    );
  };

  if (isLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Company team</h1>
            <p className="mt-1 text-sm text-gray-500">{companyName}</p>
          </div>
          <button
            onClick={() => navigate('/clients')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Back to workspace
          </button>
        </div>

        <section className="bg-white shadow rounded-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <UserPlus size={16} strokeWidth={1.5} className="text-gray-600" />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Add company subadmin
              </h2>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleAddSubadmin} className="space-y-5">
              <div>
                <label
                  htmlFor="subadmin-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subadmin email
                </label>
                <input
                  id="subadmin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  className="w-full pl-3 pr-3 py-2 border rounded-md text-sm leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                {emailError && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
                {inviteError && <p className="mt-1 text-xs text-red-600">{inviteError}</p>}
              </div>

              <div>
                <label
                  htmlFor="access-level"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Access level
                </label>
                <select
                  id="access-level"
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
                  className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md text-sm leading-5 bg-white focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {ACCESS_LEVEL_ORDER.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Add subadmin
                  </>
                )}
              </button>
            </form>

            {submitSuccess && (
              <div className="mt-4 flex items-start gap-2 px-3 py-2 rounded bg-green-50 border border-green-100">
                <CheckCircle size={14} strokeWidth={1.5} className="text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{submitSuccess}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Access levels</h3>
              <div className="grid grid-cols-1 gap-4">
                {ACCESS_LEVEL_ORDER.map((level) => (
                  <div key={level} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={14} strokeWidth={1.5} className={`text-gray-600 ${ROLE_COLORS[level]}`} />
                      <h4 className="text-sm font-medium text-gray-900">{level}</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{ROLE_DESCRIPTIONS[level]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white shadow rounded-lg border border-gray-200 mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Users size={16} strokeWidth={1.5} className="text-gray-600" />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Active members
              </h2>
            </div>
          </div>

          <div className="p-6">
            {activeMembers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No active members yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {activeMembers.map((member) => {
                  const isOwner = member.role === 'Workspace owner';
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                        <Users size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.email}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                      {isOwner ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <Crown size={10} />
                          Owner
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE_CLASSES[member.role as AccessLevel]}`}
                        >
                          {member.role}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Mail size={16} strokeWidth={1.5} className="text-gray-600" />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Pending subadmins
              </h2>
            </div>
          </div>

          <div className="p-6">
            {pendingInvites.length === 0 ? (
              <div className="text-center py-8">
                <XCircle size={32} strokeWidth={1.5} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No pending subadmins</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center gap-4 px-4 py-3 border border-gray-200 rounded-lg"
                  >
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{invite.email}</p>
                      <p className="text-xs text-gray-500">
                        {invite.accessLevel} · invited {formatDate(invite.invitedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invite.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : invite.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {invite.status === 'pending'
                          ? 'Pending'
                          : invite.status === 'accepted'
                          ? 'Accepted'
                          : 'Cancelled'}
                      </span>
                      {invite.status === 'pending' && (
                        <button
                          onClick={() => handleCancelInvite(invite.id)}
                          className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default CompanyTeamPage;
