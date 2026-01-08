import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiHome, FiSave, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    roomNo: user?.roomNo || '',
    phoneNo: user?.phoneNo || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-500 mb-4 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        <span>Back</span>
      </button>

      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Profile</h1>

      <div className="card">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-6 pb-6 border-b text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl sm:text-3xl font-bold text-primary-500">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.regimentNo}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-info' : 'badge-success'} mt-1`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Read-only Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 pb-6 border-b text-sm">
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Regiment No</p>
            <p className="font-medium">{user?.regimentNo}</p>
          </div>
          <div>
            <p className="text-xs sm:text-sm text-gray-500">Group</p>
            <p className="font-medium">{user?.group}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs sm:text-sm text-gray-500">Email</p>
            <p className="font-medium break-all">{user?.email}</p>
          </div>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="input-field pl-10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Room Number</label>
            <div className="relative">
              <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="input-field pl-10"
                value={formData.roomNo}
                onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                className="input-field pl-10"
                value={formData.phoneNo}
                onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2" disabled={loading}>
            <FiSave />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
