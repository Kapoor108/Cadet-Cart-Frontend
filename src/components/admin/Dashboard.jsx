import { useState, useEffect } from 'react';
import { FiShoppingBag, FiUsers, FiDollarSign, FiClock, FiPackage, FiAlertTriangle } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [inventoryStats, setInventoryStats] = useState({ total: 0, lowStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, analyticsRes, productsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/analytics?days=7'),
          api.get('/admin/products')
        ]);
        setStats(dashRes.data.data);
        setAnalytics(analyticsRes.data.data);
        
        // Calculate inventory stats
        const products = productsRes.data.data;
        setInventoryStats({
          total: products.length,
          lowStock: products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10).length,
          outOfStock: products.filter(p => !p.inStock || p.stockQuantity === 0).length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statusColors = {
    pending_payment: '#FCD34D',
    payment_verified: '#60A5FA',
    processing: '#A78BFA',
    out_for_delivery: '#34D399',
    delivered: '#10B981',
    cancelled: '#EF4444'
  };

  const pieData = stats?.ordersByStatus ? Object.entries(stats.ordersByStatus).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value
  })) : [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Today's Orders</p>
              <p className="text-xl sm:text-2xl font-bold">{stats?.orders?.today || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <FiShoppingBag className="text-primary-500 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats?.pendingPayments || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <FiClock className="text-yellow-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Revenue</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">{formatCurrency(stats?.revenue || 0)}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <FiDollarSign className="text-green-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Cadets</p>
              <p className="text-xl sm:text-2xl font-bold">{stats?.totalUsers || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <FiUsers className="text-blue-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Products</p>
              <p className="text-xl sm:text-2xl font-bold">{inventoryStats.total}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <FiPackage className="text-purple-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">Alerts</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{inventoryStats.lowStock + inventoryStats.outOfStock}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <FiAlertTriangle className="text-red-600 text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Orders by Status</h3>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ value }) => value}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={Object.values(statusColors)[index % Object.values(statusColors).length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Daily Orders (Last 7 Days)</h3>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.dailyOrders || []}>
                <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4A5D23" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Order Summary</h3>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <p className="text-xl sm:text-3xl font-bold text-primary-500">{stats?.orders?.week || 0}</p>
            <p className="text-xs sm:text-sm text-gray-500">This Week</p>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-bold text-primary-500">{stats?.orders?.month || 0}</p>
            <p className="text-xs sm:text-sm text-gray-500">This Month</p>
          </div>
          <div>
            <p className="text-xl sm:text-3xl font-bold text-primary-500">{stats?.orders?.total || 0}</p>
            <p className="text-xs sm:text-sm text-gray-500">All Time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
