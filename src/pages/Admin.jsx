import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiShoppingBag, FiUsers, FiBarChart2, FiBell, FiPackage, FiMessageSquare, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Dashboard from '../components/admin/Dashboard';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import InventoryManagement from '../components/admin/InventoryManagement';
import Analytics from '../components/admin/Analytics';
import Messages from '../components/admin/Messages';
import { toast } from 'react-hot-toast';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: FiGrid },
    { path: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
    { path: '/admin/messages', label: 'Messages', icon: FiMessageSquare },
    { path: '/admin/inventory', label: 'Inventory', icon: FiPackage },
    { path: '/admin/users', label: 'Users', icon: FiUsers },
    { path: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 }
  ];

  useEffect(() => {
    if (socket) {
      socket.on('newOrder', ({ order }) => {
        toast.success(`New order received: ${order.orderNumber}`);
        setNotifications(prev => [...prev, { type: 'order', data: order }]);
      });

      socket.on('paymentUploaded', ({ orderId }) => {
        toast.success('New payment uploaded for verification');
        setNotifications(prev => [...prev, { type: 'payment', orderId }]);
      });

      socket.on('newMessage', ({ message }) => {
        toast.success(`New message from ${message.senderDetails?.name}`);
        setNotifications(prev => [...prev, { type: 'message', data: message }]);
      });
    }

    return () => {
      if (socket) {
        socket.off('newOrder');
        socket.off('paymentUploaded');
        socket.off('newMessage');
      }
    };
  }, [socket]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="w-56 lg:w-64 bg-white shadow-md min-h-screen hidden md:block fixed left-0 top-16">
          <div className="p-3 lg:p-4 border-b">
            <h2 className="text-lg lg:text-xl font-bold text-primary-500">Admin Panel</h2>
          </div>
          <nav className="p-2 lg:p-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg mb-1 lg:mb-2 transition-colors text-sm lg:text-base ${
                  location.pathname === item.path
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 safe-area-bottom">
          <div className="flex justify-around py-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 min-w-0 ${
                  location.pathname === item.path ? 'text-primary-500' : 'text-gray-500'
                }`}
              >
                <item.icon size={18} />
                <span className="text-[10px] mt-0.5 truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-20 md:pb-6 md:ml-56 lg:ml-64">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary-500 mb-4 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
              {navItems.find(i => i.path === location.pathname)?.label || 'Admin'}
            </h1>
            <div className="relative">
              <button className="p-2 hover:bg-gray-200 rounded-full relative">
                <FiBell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Routes */}
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="messages" element={<Messages />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admin;
