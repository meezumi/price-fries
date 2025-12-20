'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/Loaders'

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'password' | 'delete'>('info');
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          router.push('/auth/login');
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage('');
    setPasswordError('');

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || 'Failed to change password');
        return;
      }

      setPasswordMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (error: any) {
      setPasswordError(error.message || 'An error occurred');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteMessage('');
    setDeleteError('');

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/user/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: deletePassword })
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.error || 'Failed to delete account');
        return;
      }

      setDeleteMessage('Account deleted. Redirecting...');
      localStorage.removeItem('auth-token');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error: any) {
      setDeleteError(error.message || 'An error occurred');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-2">
            Price<span className="text-teal-500">Fries</span> Profile
          </h1>
          <p className="text-gray-600 mb-8">Manage your account settings</p>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-3 px-4 font-semibold transition ${
                activeTab === 'info'
                  ? 'text-teal-500 border-b-2 border-teal-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Account Info
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`pb-3 px-4 font-semibold transition ${
                activeTab === 'password'
                  ? 'text-teal-500 border-b-2 border-teal-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab('delete')}
              className={`pb-3 px-4 font-semibold transition ${
                activeTab === 'delete'
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Delete Account
            </button>
          </div>

          {/* Account Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Account Status
                </label>
                <input
                  type="text"
                  value={user?.isVerified ? 'Verified' : 'Pending Verification'}
                  disabled
                  className={`w-full px-3 py-2 rounded border ${
                    user?.isVerified
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-yellow-50 border-yellow-300 text-yellow-700'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Member Since
                </label>
                <input
                  type="text"
                  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tracked Products
                </label>
                <input
                  type="text"
                  value={user?.trackedProductsCount || 0}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded border border-gray-300"
                />
              </div>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordMessage && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {passwordMessage}
                </div>
              )}
              {passwordError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {passwordError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-teal-500 text-white font-semibold py-2 rounded hover:bg-teal-600 transition disabled:opacity-50"
              >
                {passwordLoading ? <Spinner size="small" /> : 'Change Password'}
              </button>
            </form>
          )}

          {/* Delete Account Tab */}
          {activeTab === 'delete' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700 font-semibold mb-2">⚠️ Danger Zone</p>
                <p className="text-sm text-red-600">
                  Deleting your account is permanent and cannot be undone. All your data will be lost.
                </p>
              </div>

              {deleteMessage && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  {deleteMessage}
                </div>
              )}
              {deleteError && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {deleteError}
                </div>
              )}

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition"
                >
                  Delete My Account
                </button>
              ) : (
                <form onSubmit={handleDeleteAccount} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Enter your password to confirm deletion
                    </label>
                    <input
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={deleteLoading}
                      className="flex-1 bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
                    >
                      {deleteLoading ? <Spinner size="small" /> : 'Confirm Delete'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
