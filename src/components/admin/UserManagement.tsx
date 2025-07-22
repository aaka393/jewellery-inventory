import React, { useState } from 'react';
import { Users, Crown, Mail, Phone, Send, Package } from 'lucide-react';
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
    <div className="space-y-6 font-serif text-[#4A3F36] bg-[#F9F6F1] p-4 rounded-xl">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        {[
          { icon: <Users className="text-[#4A3F36]" />, label: 'Total Users', count: stats.total },
          { icon: <Crown className="text-[#DEC9A3]" />, label: 'Admins', count: stats.admins },
          { icon: <Users className="text-gray-500" />, label: 'Regular Users', count: stats.users },
        ].map(({ icon, label, count }) => (
          <div key={label} className="bg-white rounded-xl shadow p-6 flex items-center">
            <div className="p-2 bg-[#F9F6F1] rounded-lg">{icon}</div>
            <div className="ml-4">
              <p className="text-sm font-light italic text-[#4A3F36]">{label}</p>
              <p className="text-2xl font-semibold text-[#4A3F36]">{count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#4A3F36] italic">Users</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#DEC9A3] transition"
          >
            <option value="all">All Users ({stats.total})</option>
            <option value="admin">Admins ({stats.admins})</option>
            <option value="user">Regular Users ({stats.users})</option>
          </select>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#4A3F36] mb-2 italic">No users found</h3>
            <p className="text-gray-500">Users will appear here once they register.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#F9F6F1]">
                <tr>
                  {['User', 'Contact', 'Role', 'Actions'].map((heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium text-[#4A3F36] uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    {/* User Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#F9F6F1] flex items-center justify-center overflow-hidden">
                          {user.avatar ? (
                            <img src={user.avatar} alt={`${user.firstname} ${user.lastname}`} className="h-full w-full object-cover" />
                          ) : (
                            <Users className="h-5 w-5 text-[#4A3F36]" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#4A3F36]">{user.firstname} {user.lastname}</div>
                          <div className="text-sm text-gray-500 italic">@{user.username}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A3F36]">
                      <div className="flex items-center mb-1">
                        <Mail className="h-3 w-3 text-gray-400 mr-1" />
                        {user.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 text-gray-400 mr-1" />
                        {user.contact}
                      </div>
                    </td>

                    {/* Role Select */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role || 'User'}
                        onChange={(e) => confirmRoleChange(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#DEC9A3] transition"
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            setTrackingConfirmDialog({
                              isOpen: true,
                              userId: user.id,
                              orderId: user?.latestOrderId, // or whatever field you have
                            })
                          }

                          disabled={trackingLoading === user.id}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-[#DEC9A3] text-[#4A3F36] hover:bg-[#c9b283] transition disabled:opacity-50"
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

      {/* Confirm Dialogs & Toasts */}
      <ConfirmDialog
        isOpen={trackingConfirmDialog.isOpen}
        onClose={() => {
          setTrackingConfirmDialog({ isOpen: false });
          setCustomTrackingNumber('');
        }}
        onConfirm={() => {
          if (trackingConfirmDialog.userId && trackingConfirmDialog.orderId && customTrackingNumber) {
            sendTrackingId(trackingConfirmDialog.userId, customTrackingNumber, trackingConfirmDialog.orderId);
          }

          setTrackingConfirmDialog({ isOpen: false });
          setCustomTrackingNumber('');
        }}
        title="Send Tracking ID"
        confirmText="Send"
        message={
          <>
            <p className="mb-2 text-[#4A3F36] font-light italic">Enter the tracking number for this user:</p>
            <input
              type="text"
              value={customTrackingNumber}
              onChange={(e) => setCustomTrackingNumber(e.target.value)}
              placeholder="Tracking Number"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#DEC9A3] transition"
            />
          </>
        }
      />

      <ConfirmDialog
        isOpen={roleChangeDialog.isOpen}
        onClose={() => setRoleChangeDialog({ isOpen: false })}
        onConfirm={handleUpdateUserRole}
        title="Change User Role"
        message={`Are you sure you want to change this user's role to "${roleChangeDialog.newRole}"?`}
        confirmText="Change"
      />

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
