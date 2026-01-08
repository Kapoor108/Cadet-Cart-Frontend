import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiEye, FiArrowLeft } from 'react-icons/fi';
import { useOrders } from '../hooks/useOrders';
import { ORDER_STATUS, PAYMENT_STATUS, formatCurrency, formatDate } from '../utils/constants';
import OrderTracking from '../components/order/OrderTracking';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyOrders = () => {
  const navigate = useNavigate();
  const { orders, loading, fetchOrders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-primary-500 mb-4 transition-colors"
      >
        <FiArrowLeft className="mr-2" />
        <span>Back</span>
      </button>

      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="card text-center py-8 sm:py-12">
          <FiPackage className="mx-auto text-5xl sm:text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-4 text-sm sm:text-base">Start shopping to see your orders here</p>
          <a href="/shop" className="btn-primary inline-block">Shop Now</a>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map(order => (
            <div key={order._id} className="card">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                      <span className="font-mono font-medium text-sm sm:text-base">{order.orderNumber}</span>
                      <span className={`badge ${ORDER_STATUS[order.orderStatus]?.color}`}>
                        {ORDER_STATUS[order.orderStatus]?.label}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <div className="sm:text-right">
                      <p className="font-semibold text-sm sm:text-base">{formatCurrency(order.totalAmount)}</p>
                      <span className={`badge text-xs ${PAYMENT_STATUS[order.paymentStatus]?.color}`}>
                        {PAYMENT_STATUS[order.paymentStatus]?.label}
                      </span>
                    </div>
                    <button
                      className="btn-outline flex items-center space-x-1 sm:space-x-2 text-sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <FiEye />
                      <span>Track</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[95vh] overflow-y-auto">
            <div className="p-3 sm:p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-sm sm:text-base">Order Tracking</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-3 sm:p-4">
              <OrderTracking order={selectedOrder} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
