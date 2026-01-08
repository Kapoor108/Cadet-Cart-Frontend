import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/admin/analytics?days=${days}`);
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [days]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Time Range Selector */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="text-xs sm:text-sm font-medium">Time Range:</span>
          <div className="flex flex-wrap gap-2">
            {[7, 14, 30, 90].map(d => (
              <button
                key={d}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm ${days === d ? 'bg-primary-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setDays(d)}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Daily Orders</h3>
          <div className="h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.dailyOrders || []}>
                <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4A5D23" strokeWidth={2} dot={{ fill: '#4A5D23', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Daily Revenue</h3>
          <div className="h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.revenueByDay || []}>
                <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `₹${v}`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#FFD700" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Popular Items</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
          {data?.popularItems?.slice(0, 10).map((item, idx) => (
            <div key={idx} className="text-center p-2 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-xl sm:text-2xl font-bold text-primary-500">{item.count}</p>
              <p className="text-xs sm:text-sm text-gray-600 capitalize truncate">{item._id.replace(/([A-Z])/g, ' $1').trim()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
