import { FiCheckCircle, FiPhone } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/constants';

const PaymentSuccess = ({ order }) => {
  return (
    <div className="card text-center max-w-md mx-auto">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiCheckCircle className="text-green-500 text-4xl" />
      </div>

      <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Submitted!</h2>
      <p className="text-gray-600 mb-6">
        Your payment proof has been uploaded successfully.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-500">Order Number</p>
        <p className="text-xl font-bold text-primary-500">{order.orderNumber}</p>
        <p className="text-sm text-gray-500 mt-2">Amount</p>
        <p className="text-lg font-semibold">{formatCurrency(order.totalAmount)}</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center text-blue-600 mb-2">
          <FiPhone className="mr-2" />
          <span className="font-medium">What's Next?</span>
        </div>
        <p className="text-sm text-blue-700">
          You will receive a call from our delivery partner within a few minutes after payment verification.
        </p>
      </div>

      <div className="space-y-3">
        <Link to="/my-orders" className="btn-primary w-full block">
          Track Your Order
        </Link>
        <Link to="/shop" className="btn-outline w-full block">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
