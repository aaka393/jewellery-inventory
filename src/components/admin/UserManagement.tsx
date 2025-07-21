import React, { useState, useEffect } from 'react';
import { Users, Crown, Mail, Phone, Send, Package } from 'lucide-react';
import { User } from '../../types';
import { RoleChangeDialog, TrackingConfirmDialog } from '../../types/admin';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import NotificationToast from './NotificationToast';
import { useUserManagement } from '../../hooks/useUserManagement';

const UserManagement: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [customTrackingNumber, setCustomTrackingNumber] = useState('');

  const [trackingConfirmDialog, setTrackingConfirmDialog] = useState<TrackingConfirmDialog>({ isOpen: false });
  const [roleChangeDialog, setRoleChangeDialog] = useState<RoleChangeDialog>({ isOpen: false });

  const {
    users,
    loading,
    trackingLoading,
    userOrderCounts,
    notification,
    setNotification,
    sendTrackingId,
    updateUserRole,
    getUserStats,
  } = useUserManagement();
  const confirmRoleChange = (userId: string, newRole: string) => {
    setRoleChangeDialog({ isOpen: true, userId, newRole });
  };

  const handleUpdateUserRole = async () => {
    try {
      if (!roleChangeDialog.userId || !roleChangeDialog.newRole) return;
      await updateUserRole(roleChangeDialog.userId, roleChangeDialog.newRole);
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setRoleChangeDialog({ isOpen: false });
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'admin') return user.role === 'Admin';
    if (filter === 'user') return user.role === 'User' || !user.role;
    return true;
  });

  if (loading) return <LoadingSpinner />;
  const stats = getUserStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        {[
          { icon: <Users className="text-blue-600" />, label: 'Total Users', count: stats.total },
          { icon: <Crown className="text-purple-600" />, label: 'Admins', count: stats.admins },
          { icon: <Users className="text-gray-600" />, label: 'Regular Users', count: stats.users },
        ].map(({ icon, label, count }) => (
          <div key={label} className="bg-white rounded-lg shadow-sm p-6 flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Users</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Users ({stats.total})</option>
            <option value="admin">Admins ({stats.admins})</option>
            <option value="user">Regular Users ({stats.users})</option>
          </select>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Users will appear here once they register.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar ? (
                            <img src={user.avatar} alt={`${user.firstname} ${user.lastname}`} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.firstname} {user.lastname}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Mail className="h-3 w-3 text-gray-400 mr-1" />
                          {user.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 text-gray-400 mr-1" />
                          {user.contact}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role || 'User'}
                        onChange={(e) => confirmRoleChange(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setTrackingConfirmDialog({ isOpen: true, userId: user.id })}
                          disabled={trackingLoading === user.id}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {trackingLoading === user.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-3 w-3 mr-1" />
                              Send Tracking
                            </>
                          )}
                        </button>

                        {userOrderCounts[user.id] !== undefined && (
                          <div className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            <Package className="h-3 w-3 mr-1" />
                            {userOrderCounts[user.id]} products ordered
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={trackingConfirmDialog.isOpen}
        onClose={() => {
          setTrackingConfirmDialog({ isOpen: false });
          setCustomTrackingNumber('');
        }}
        onConfirm={() => {
          if (trackingConfirmDialog.userId && customTrackingNumber) {
            sendTrackingId(trackingConfirmDialog.userId, customTrackingNumber);
          }
          setTrackingConfirmDialog({ isOpen: false });
          setCustomTrackingNumber('');
        }}
        title="Send Tracking ID"
        confirmText="Send"
        message={
          <>
            <p className="mb-2">Enter the tracking number for this user:</p>
            <input
              type="text"
              value={customTrackingNumber}
              onChange={(e) => setCustomTrackingNumber(e.target.value)}
              placeholder="Tracking Number"
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </>
        }
      />

      {/* Confirm Role Change Dialog */}
      <ConfirmDialog
        isOpen={roleChangeDialog.isOpen}
        onClose={() => setRoleChangeDialog({ isOpen: false })}
        onConfirm={handleUpdateUserRole}
        title="Change User Role"
        message={`Are you sure you want to change this user's role to "${roleChangeDialog.newRole}"?`}
        confirmText="Change"
      />

      {/* Notification Toast */}
      <NotificationToast
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification((prev: any) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default UserManagement;
