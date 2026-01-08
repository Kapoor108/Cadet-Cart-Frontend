import { FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/constants';

const OrderSummary = ({ onBack, onConfirm, loading, specialRequests }) => {
  const { calculateTotal, getSelectedItems } = useCart();
  const { user } = useAuth();

  const selectedItems = getSelectedItems();
  const uniformItems = selectedItems.filter(item => item.category === 'uniform');
  const foodItems = selectedItems.filter(item => item.category === 'food');
  const hasItems = selectedItems.length > 0;
  const hasOnlySpecialRequests = !hasItems && specialRequests?.trim();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Warning for only special requests */}
      {hasOnlySpecialRequests && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <FiAlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-medium text-yellow-800">No items selected</h4>
              <p className="text-sm text-yellow-700 mt-1">
                You have only special requests without any items. To send a message or request without placing an order, please use the{' '}
                <Link to="/contact" className="text-primary-600 underline font-medium">Contact Page</Link>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cadet Details */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Delivery Details</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div><span className="text-gray-500">Name:</span> {user.name}</div>
          <div><span className="text-gray-500">Regiment:</span> {user.regimentNo}</div>
          <div><span className="text-gray-500">Group:</span> {user.group}</div>
          <div><span className="text-gray-500">Room:</span> {user.roomNo}</div>
          <div className="col-span-2 sm:col-span-1"><span className="text-gray-500">Phone:</span> {user.phoneNo}</div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Order Items</h3>
        
        {uniformItems.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-600 mb-2 text-sm sm:text-base">Uniform Items</h4>
            <div className="space-y-2">
              {uniformItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs sm:text-sm py-2 border-b">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="block truncate">{item.itemName}</span>
                    <span className="text-gray-500">
                      {item.size && `(${item.size}) `}x{item.quantity || 1}
                    </span>
                  </div>
                  <span className="font-medium flex-shrink-0">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {foodItems.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-600 mb-2 text-sm sm:text-base">Food Items</h4>
            <div className="space-y-2">
              {foodItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs sm:text-sm py-2 border-b">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="block truncate">{item.itemName}</span>
                    <span className="text-gray-500">x{item.quantity || 1}</span>
                  </div>
                  <span className="font-medium flex-shrink-0">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedItems.length === 0 && !specialRequests && (
          <p className="text-gray-500 text-center py-4 text-sm">No items selected</p>
        )}

        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-semibold">Subtotal</span>
            <span className="text-lg sm:text-xl font-bold text-gray-700">{formatCurrency(calculateTotal())}</span>
          </div>
          
          {/* Free Delivery */}
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-lg font-semibold">Delivery</span>
            <div className="text-right">
              <span className="text-lg sm:text-xl font-bold text-green-600">FREE</span>
              <div className="text-xs text-green-600 font-medium">🚚 Free delivery to your room</div>
            </div>
          </div>
          
          {/* Total */}
          <div className="flex justify-between items-center pt-3 border-t-2 border-primary-200">
            <span className="text-lg sm:text-xl font-bold">Total</span>
            <span className="text-xl sm:text-2xl font-bold text-primary-500">{formatCurrency(calculateTotal())}</span>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      {specialRequests && (
        <div className="card border-2 border-primary-200 bg-primary-50/30">
          <div className="flex items-center space-x-2 mb-2">
            <FiMessageSquare className="text-primary-500" />
            <h4 className="font-semibold text-primary-700">Special Requests</h4>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{specialRequests}</p>
          <p className="text-xs text-gray-500 mt-2">
            * Admin will review your special requests and contact you if needed
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <button className="btn-outline order-2 sm:order-1" onClick={onBack}>Back to Items</button>
        {hasOnlySpecialRequests ? (
          <Link to="/contact" className="btn-primary order-1 sm:order-2 text-center">
            Go to Contact Page
          </Link>
        ) : (
          <button 
            className="btn-primary order-1 sm:order-2" 
            onClick={onConfirm} 
            disabled={loading || selectedItems.length === 0}
          >
            {loading ? 'Placing Order...' : 'Place Order & Pay'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
