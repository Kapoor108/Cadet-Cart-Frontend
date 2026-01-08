import { useState, useEffect } from 'react';
import { FiSearch, FiShield, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      
      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId, userName, userEmail) => {
    const confirmMessage = `Are you sure you want to delete user "${userName}" (${userEmail})?\n\nThis will:\n• Permanently delete their account\n• Remove all their data\n• Cannot be undone\n\nType "DELETE" to confirm:`;
    
    const userInput = window.prompt(confirmMessage);
    if (userInput !== 'DELETE') {
      if (userInput !== null) {
        toast.error('Deletion cancelled - you must type "DELETE" to confirm');
      }
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="input-field pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <select
            className="input-field sm:w-40"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="cadet">Cadet</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="card hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-3 text-sm">Name</th>
              <th className="text-left py-3 px-3 text-sm">Regiment</th>
              <th className="text-left py-3 px-3 text-sm">Group</th>
              <th className="text-left py-3 px-3 text-sm">Contact</th>
              <th className="text-left py-3 px-3 text-sm">Role</th>
              <th className="text-left py-3 px-3 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono text-xs">{user.regimentNo}</td>
                <td className="py-3 px-3 text-sm">{user.group}</td>
                <td className="py-3 px-3">
                  <p className="text-sm">{user.phoneNo}</p>
                  <p className="text-xs text-gray-500">Room: {user.roomNo}</p>
                </td>
                <td className="py-3 px-3">
                  <span className={`badge ${user.role === 'admin' ? 'badge-info' : 'badge-success'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    {user.role !== 'admin' ? (
                      <button
                        className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 p-1"
                        onClick={() => handleRoleChange(user._id, 'admin')}
                      >
                        <FiShield size={12} />
                        <span>Make Admin</span>
                      </button>
                    ) : (
                      <button
                        className="text-xs text-gray-600 hover:text-gray-800 p-1"
                        onClick={() => handleRoleChange(user._id, 'cadet')}
                      >
                        Remove Admin
                      </button>
                    )}
                    {user.role !== 'admin' && (
                      <button
                        className="p-1.5 hover:bg-red-100 rounded text-red-600"
                        onClick={() => handleDeleteUser(user._id, user.name, user.email)}
                        title="Delete User"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center py-8 text-gray-500">No users found</p>
        )}
      </div>

      {/* Users Cards - Mobile */}
      <div className="sm:hidden space-y-3">
        {users.map(user => (
          <div key={user._id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <span className={`badge ${user.role === 'admin' ? 'badge-info' : 'badge-success'}`}>
                {user.role}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div><span className="text-gray-500">Regiment:</span> {user.regimentNo}</div>
              <div><span className="text-gray-500">Group:</span> {user.group}</div>
              <div><span className="text-gray-500">Phone:</span> {user.phoneNo}</div>
              <div><span className="text-gray-500">Room:</span> {user.roomNo}</div>
            </div>
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <div>
                  {user.role !== 'admin' ? (
                    <button
                      className="flex items-center space-x-1 text-sm text-blue-600"
                      onClick={() => handleRoleChange(user._id, 'admin')}
                    >
                      <FiShield size={14} />
                      <span>Make Admin</span>
                    </button>
                  ) : (
                    <button
                      className="text-sm text-gray-600"
                      onClick={() => handleRoleChange(user._id, 'cadet')}
                    >
                      Remove Admin
                    </button>
                  )}
                </div>
                {user.role !== 'admin' && (
                  <button
                    className="p-2 hover:bg-red-100 rounded text-red-600"
                    onClick={() => handleDeleteUser(user._id, user.name, user.email)}
                    title="Delete User"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="card text-center py-8 text-gray-500">No users found</div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
