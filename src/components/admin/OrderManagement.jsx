import { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiCheck, FiX, FiTruck, FiImage, FiMessageSquare, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { ORDER_STATUS, PAYMENT_STATUS, formatCurrency, formatDate } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({ name: '', phone: '' });

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/admin/orders?${params}`);
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleVerifyPayment = async (orderId, approved) => {
    try {
      await api.put(`/admin/orders/${orderId}/verify-payment`, {
        approved,
        notes: approved ? 'Payment verified' : 'Payment rejected'
      });
      toast.success(approved ? 'Payment verified' : 'Payment rejected');
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAssignDelivery = async () => {
    if (!deliveryForm.name || !deliveryForm.phone) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await api.put(`/admin/orders/${selectedOrder._id}/assign-delivery`, deliveryForm);
      toast.success('Delivery partner assigned');
      setShowModal(false);
      setDeliveryForm({ name: '', phone: '' });
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to assign delivery');
    }
  };

  const viewPaymentScreenshot = (order) => {
    setSelectedOrder(order);
    setShowImageModal(true);
  };

  const viewSpecialRequests = (order) => {
    setSelectedOrder(order);
    setShowMessageModal(true);
  };

  // Helper function to get ordered items from order data
  const getOrderedItems = (order) => {
    const items = [];
    
    // Extract uniform items
    if (order.uniformItems) {
      Object.entries(order.uniformItems).forEach(([name, item]) => {
        if (item.selected) {
          items.push({
            name,
            category: 'Uniform',
            size: item.size,
            quantity: item.quantity || 1,
            price: item.price || 0,
            subtotal: (item.price || 0) * (item.quantity || 1)
          });
        }
      });
    }
    
    // Extract food items
    if (order.foodItems) {
      Object.entries(order.foodItems).forEach(([name, item]) => {
        if (item.selected) {
          items.push({
            name,
            category: 'Food',
            portion: item.portion,
            type: item.type || item.style,
            quantity: item.quantity || 1,
            price: item.price || 0,
            subtotal: (item.price || 0) * (item.quantity || 1)
          });
        }
      });
    }
    
    return items;
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
                placeholder="Search orders..."
                className="input-field pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          <select
            className="input-field sm:w-48"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            {Object.entries(ORDER_STATUS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {orders.map(order => (
          <div key={order._id} className="card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                <p className="text-sm font-medium">{order.cadetDetails?.name}</p>
                <p className="text-xs text-gray-500">{order.cadetDetails?.regimentNo}</p>
              </div>
              <span className={`badge ${ORDER_STATUS[order.orderStatus]?.color}`}>
                {ORDER_STATUS[order.orderStatus]?.label}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
              <div className="flex items-center space-x-2">
                <span className={`badge ${PAYMENT_STATUS[order.paymentStatus]?.color}`}>
                  {PAYMENT_STATUS[order.paymentStatus]?.label}
                </span>
                {order.specialRequests && (
                  <button
                    className="p-1 text-primary-500 hover:bg-primary-50 rounded"
                    onClick={() => viewSpecialRequests(order)}
                  >
                    <FiMessageSquare size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
              <div className="flex items-center space-x-2">
                {order.paymentScreenshot && (
                  <button
                    className="p-2 bg-blue-50 rounded text-blue-600"
                    onClick={() => viewPaymentScreenshot(order)}
                  >
                    <FiImage size={18} />
                  </button>
                )}
                <button
                  className="p-2 bg-gray-100 rounded"
                  onClick={() => { setSelectedOrder(order); setShowModal(false); setShowImageModal(false); }}
                >
                  <FiEye size={18} />
                </button>
                {order.paymentStatus === 'processing' && (
                  <>
                    <button
                      className="p-2 bg-green-50 rounded text-green-600"
                      onClick={() => handleVerifyPayment(order._id, true)}
                    >
                      <FiCheck size={18} />
                    </button>
                    <button
                      className="p-2 bg-red-50 rounded text-red-600"
                      onClick={() => handleVerifyPayment(order._id, false)}
                    >
                      <FiX size={18} />
                    </button>
                  </>
                )}
                {(order.orderStatus === 'payment_verified' || order.orderStatus === 'processing') && (
                  <button
                    className="p-2 bg-blue-50 rounded text-blue-600"
                    onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                  >
                    <FiTruck size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="card hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Order #</th>
              <th className="text-left py-3 px-4">Cadet</th>
              <th className="text-left py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Payment</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-sm">{order.orderNumber}</td>
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{order.cadetDetails?.name}</p>
                    <p className="text-xs text-gray-500">{order.cadetDetails?.regimentNo}</p>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium">{formatCurrency(order.totalAmount)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className={`badge ${PAYMENT_STATUS[order.paymentStatus]?.color}`}>
                      {PAYMENT_STATUS[order.paymentStatus]?.label}
                    </span>
                    {order.paymentScreenshot && (
                      <button
                        className="p-1 hover:bg-blue-100 rounded text-blue-600"
                        onClick={() => viewPaymentScreenshot(order)}
                        title="View Screenshot"
                      >
                        <FiImage size={16} />
                      </button>
                    )}
                    {order.specialRequests && (
                      <button
                        className="p-1 hover:bg-primary-100 rounded text-primary-600"
                        onClick={() => viewSpecialRequests(order)}
                        title="View Special Requests"
                      >
                        <FiMessageSquare size={16} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`badge ${ORDER_STATUS[order.orderStatus]?.color}`}>
                    {ORDER_STATUS[order.orderStatus]?.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 hover:bg-gray-100 rounded"
                      onClick={() => { setSelectedOrder(order); setShowModal(false); setShowImageModal(false); }}
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                    
                    {order.paymentStatus === 'processing' && (
                      <>
                        <button
                          className="p-2 hover:bg-green-100 rounded text-green-600"
                          onClick={() => handleVerifyPayment(order._id, true)}
                          title="Verify Payment"
                        >
                          <FiCheck />
                        </button>
                        <button
                          className="p-2 hover:bg-red-100 rounded text-red-600"
                          onClick={() => handleVerifyPayment(order._id, false)}
                          title="Reject Payment"
                        >
                          <FiX />
                        </button>
                      </>
                    )}
                    
                    {(order.orderStatus === 'payment_verified' || order.orderStatus === 'processing') && (
                      <button
                        className="p-2 hover:bg-blue-100 rounded text-blue-600"
                        onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                        title="Assign Delivery"
                      >
                        <FiTruck />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <p className="text-center py-8 text-gray-500">No orders found</p>
        )}
      </div>

      {/* Empty state for mobile */}
      {orders.length === 0 && (
        <div className="sm:hidden card text-center py-8 text-gray-500">No orders found</div>
      )}

      {/* Payment Screenshot Modal */}
      {showImageModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-3 sm:p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-base sm:text-lg font-bold truncate pr-2">Payment - {selectedOrder.orderNumber}</h3>
              <button onClick={() => { setShowImageModal(false); setSelectedOrder(null); }} className="text-gray-500 hover:text-gray-700 p-1">
                <FiX size={24} />
              </button>
            </div>
            <div className="p-3 sm:p-4">
              <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div><span className="text-gray-500">Amount:</span> <span className="font-bold">{formatCurrency(selectedOrder.totalAmount)}</span></div>
                <div><span className="text-gray-500">Cadet:</span> {selectedOrder.cadetDetails?.name}</div>
                <div><span className="text-gray-500">Regiment:</span> {selectedOrder.cadetDetails?.regimentNo}</div>
                <div><span className="text-gray-500">Phone:</span> {selectedOrder.cadetDetails?.phoneNo}</div>
              </div>
              
              {selectedOrder.paymentScreenshot && (
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={selectedOrder.paymentScreenshot} 
                    alt="Payment Screenshot" 
                    className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] object-contain bg-gray-100"
                  />
                </div>
              )}

              {selectedOrder.paymentStatus === 'processing' && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                  <button
                    className="btn-primary flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center"
                    onClick={() => { handleVerifyPayment(selectedOrder._id, true); setShowImageModal(false); }}
                  >
                    <FiCheck className="mr-2" /> Verify
                  </button>
                  <button
                    className="btn-outline flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center"
                    onClick={() => { handleVerifyPayment(selectedOrder._id, false); setShowImageModal(false); }}
                  >
                    <FiX className="mr-2" /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Special Requests Modal */}
      {showMessageModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[95vh] overflow-y-auto">
            <div className="p-3 sm:p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <div className="flex items-center space-x-2">
                <FiMessageSquare className="text-primary-500" />
                <h3 className="text-base sm:text-lg font-bold">Special Requests</h3>
              </div>
              <button onClick={() => { setShowMessageModal(false); setSelectedOrder(null); }} className="text-gray-500 hover:text-gray-700 p-1">
                <FiX size={24} />
              </button>
            </div>
            <div className="p-3 sm:p-4">
              <div className="mb-4 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div><span className="text-gray-500">Order:</span> <span className="font-mono font-bold">{selectedOrder.orderNumber}</span></div>
                <div><span className="text-gray-500">Cadet:</span> {selectedOrder.cadetDetails?.name}</div>
                <div><span className="text-gray-500">Regiment:</span> {selectedOrder.cadetDetails?.regimentNo}</div>
                <div><span className="text-gray-500">Phone:</span> {selectedOrder.cadetDetails?.phoneNo}</div>
              </div>
              
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-sm font-medium text-primary-700 mb-2">Message from Cadet:</p>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedOrder.specialRequests}</p>
              </div>

              <button
                className="btn-primary w-full mt-4"
                onClick={() => { setShowMessageModal(false); setSelectedOrder(null); }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && !showModal && !showImageModal && !showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-3 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg sm:text-xl font-bold">Order #{selectedOrder.orderNumber}</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700 p-1">
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Cadet Details */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Cadet Details</h4>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div><span className="text-gray-500">Name:</span> {selectedOrder.cadetDetails?.name}</div>
                    <div><span className="text-gray-500">Regiment:</span> {selectedOrder.cadetDetails?.regimentNo}</div>
                    <div><span className="text-gray-500">Room:</span> {selectedOrder.cadetDetails?.roomNo}</div>
                    <div><span className="text-gray-500">Phone:</span> {selectedOrder.cadetDetails?.phoneNo}</div>
                    <div><span className="text-gray-500">Group:</span> {selectedOrder.cadetDetails?.group}</div>
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <FiShoppingBag className="text-primary-500" />
                    <h4 className="text-sm font-medium">Ordered Items</h4>
                  </div>
                  
                  {getOrderedItems(selectedOrder).length > 0 ? (
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <table className="w-full text-xs sm:text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left py-2 px-3">Item</th>
                            <th className="text-left py-2 px-3">Category</th>
                            <th className="text-center py-2 px-3">Qty</th>
                            <th className="text-right py-2 px-3">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getOrderedItems(selectedOrder).map((item, idx) => (
                            <tr key={idx} className="border-t border-gray-200">
                              <td className="py-2 px-3">
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  {item.size && <span className="text-gray-500 ml-1">({item.size})</span>}
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <span className={`badge ${item.category === 'Uniform' ? 'badge-info' : 'badge-success'}`}>
                                  {item.category}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center">{item.quantity}</td>
                              <td className="py-2 px-3 text-right font-medium">
                                {item.price > 0 ? formatCurrency(item.price * item.quantity) : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-100 font-medium">
                          <tr>
                            <td colSpan="3" className="py-2 px-3 text-right">Total:</td>
                            <td className="py-2 px-3 text-right text-primary-600">
                              {formatCurrency(selectedOrder.totalAmount)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No items in this order (special request only)</p>
                  )}
                </div>

                {/* Payment Screenshot */}
                {selectedOrder.paymentScreenshot && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Payment Screenshot:</p>
                    <img 
                      src={selectedOrder.paymentScreenshot} 
                      alt="Payment" 
                      className="max-h-48 sm:max-h-64 rounded-lg border cursor-pointer hover:opacity-90"
                      onClick={() => { setShowImageModal(true); }}
                    />
                  </div>
                )}

                {/* Delivery Partner */}
                {selectedOrder.deliveryPartner?.name && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Delivery Partner:</p>
                    <div className="bg-green-50 rounded-lg p-3 text-sm">
                      <p><span className="text-gray-500">Name:</span> {selectedOrder.deliveryPartner.name}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedOrder.deliveryPartner.phone}</p>
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {selectedOrder.specialRequests && (
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiMessageSquare className="text-primary-500" />
                      <p className="text-sm font-medium text-primary-700">Special Requests:</p>
                    </div>
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedOrder.specialRequests}</p>
                    </div>
                  </div>
                )}

                {/* Update Status */}
                {selectedOrder.orderStatus !== 'delivered' && selectedOrder.orderStatus !== 'cancelled' && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Update Status:</p>
                    <select
                      className="input-field"
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                    >
                      {Object.entries(ORDER_STATUS).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Delivery Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Assign Delivery Partner</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">Order: {selectedOrder.orderNumber}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Partner Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter delivery partner name"
                  value={deliveryForm.name}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="Enter phone number"
                  value={deliveryForm.phone}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, phone: e.target.value })}
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                <button className="btn-outline flex-1" onClick={() => { setShowModal(false); setSelectedOrder(null); }}>Cancel</button>
                <button className="btn-primary flex-1" onClick={handleAssignDelivery}>Assign</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
