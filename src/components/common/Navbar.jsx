import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiShoppingBag, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-xl sm:text-2xl font-bold">
              <span className="text-secondary-500">Cadet</span>
              <span className="text-white">Cart</span>
            </span>
            <div className="hidden lg:block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              🚚 FREE DELIVERY
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-secondary-500 transition-colors">Home</Link>
            {user && (
              <>
                <Link to="/shop" className="hover:text-secondary-500 transition-colors">Shop</Link>
                <Link to="/my-orders" className="hover:text-secondary-500 transition-colors">My Orders</Link>
                <Link to="/contact" className="hover:text-secondary-500 transition-colors">Contact</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-secondary-500 transition-colors">Admin</Link>
                )}
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 hover:text-secondary-500">
                  <FiUser />
                  <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="hover:text-secondary-500">
                  <FiLogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-secondary-500">Login</Link>
                <Link to="/register" className="btn-secondary text-sm">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-secondary-500">Home</Link>
              {user ? (
                <>
                  <Link to="/shop" onClick={() => setIsOpen(false)} className="hover:text-secondary-500">Shop</Link>
                  <Link to="/my-orders" onClick={() => setIsOpen(false)} className="hover:text-secondary-500">My Orders</Link>
                  <Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-secondary-500">Contact</Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="hover:text-secondary-500">Profile</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="hover:text-secondary-500">Admin</Link>
                  )}
                  <button onClick={handleLogout} className="text-left hover:text-secondary-500">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="hover:text-secondary-500">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="hover:text-secondary-500">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
