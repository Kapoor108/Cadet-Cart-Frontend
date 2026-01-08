import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiHome, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { validators, validateForm } from '../../utils/validators';
import { GROUPS } from '../../utils/constants';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', regimentNo: '', group: '', roomNo: '', phoneNo: '', email: '', password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid, errors: validationErrors } = validateForm(formData, {
      name: validators.name,
      regimentNo: validators.regimentNo,
      group: (v) => validators.required(v, 'Group'),
      roomNo: validators.roomNo,
      phoneNo: validators.phoneNo,
      email: validators.email,
      password: validators.password
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await register(formData);
      toast.success(response.message);
      navigate('/shop');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card max-w-lg w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-500 mb-4 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          <span>Back</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-500">Create Account</h1>
          <p className="text-gray-600 mt-2">Join Cadet Cart</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Regiment No</label>
              <input
                type="text"
                name="regimentNo"
                className={`input-field ${errors.regimentNo ? 'border-red-500' : ''}`}
                placeholder="Enter your regiment number"
                value={formData.regimentNo}
                onChange={handleChange}
                maxLength={30}
              />
              {errors.regimentNo && <p className="text-red-500 text-xs mt-1">{errors.regimentNo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Group</label>
              <select
                name="group"
                className={`input-field ${errors.group ? 'border-red-500' : ''}`}
                value={formData.group}
                onChange={handleChange}
              >
                <option value="">Select Group</option>
                {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.group && <p className="text-red-500 text-xs mt-1">{errors.group}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Room No</label>
              <div className="relative">
                <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="roomNo"
                  className={`input-field pl-10 ${errors.roomNo ? 'border-red-500' : ''}`}
                  placeholder="e.g., A-101"
                  value={formData.roomNo}
                  onChange={handleChange}
                />
              </div>
              {errors.roomNo && <p className="text-red-500 text-xs mt-1">{errors.roomNo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNo"
                  className={`input-field pl-10 ${errors.phoneNo ? 'border-red-500' : ''}`}
                  placeholder="10-digit number"
                  value={formData.phoneNo}
                  onChange={handleChange}
                />
              </div>
              {errors.phoneNo && <p className="text-red-500 text-xs mt-1">{errors.phoneNo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Min 8 chars, uppercase, lowercase, number, special"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary w-full mt-6" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
