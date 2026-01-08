import { FiCheckCircle, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/constants';

const PaymentSuccess = ({ order }) => {
  return (
    <div className="card text-center max-w-md mx-auto">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <FiCheckCircle className="text-green-500 text-3xl sm:text-4xl" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">Payment Submitted!</h2>
      <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
        Your payment proof has been uploaded successfully.
      </p>

      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <p className="text-xs sm:text-sm text-gray-500">Order Number</p>
        <p className="text-lg sm:text-xl font-bold text-primary-500 break-all">{order.orderNumber}</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">Amount</p>
        <p className="text-base sm:text-lg font-semibold">{formatCurrency(order.totalAmount)}</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-center text-blue-600 mb-2">
          <FiPhone className="mr-2" size={16} />
          <span className="font-medium text-sm sm:text-base">What's Next?</span>
        </div>
        <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
          You will receive a call from our delivery partner within a few minutes after payment verification.
        </p>
      </div>

      <div className="space-y-3">
        <Link to="/my-orders" className="btn-primary w-full">
          Track Your Order
        </Link>
        <Link to="/shop" className="btn-outline w-full">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
