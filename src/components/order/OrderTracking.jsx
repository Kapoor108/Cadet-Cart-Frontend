import { FiCheck, FiClock, FiTruck, FiPackage, FiCheckCircle } from 'react-icons/fi';
import { ORDER_STATUS, formatDate } from '../../utils/constants';

const OrderTracking = ({ order }) => {
  const steps = [
    { key: 'pending_payment', label: 'Order Placed', icon: FiPackage },
    { key: 'payment_verified', label: 'Payment Verified', icon: FiCheck },
    { key: 'processing', label: 'Processing', icon: FiClock },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: FiTruck },
    { key: 'delivered', label: 'Delivered', icon: FiCheckCircle }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={`badge ${ORDER_STATUS[order.orderStatus]?.color || 'badge-info'}`}>
          {ORDER_STATUS[order.orderStatus]?.label || order.orderStatus}
        </span>
      </div>

      {isCancelled ? (
        <div className="text-center py-8 text-red-500">
          <p className="text-lg font-medium">Order Cancelled</p>
        </div>
      ) : (
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200">
            <div
              className="bg-primary-500 w-full transition-all duration-500"
              style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;
              const historyItem = order.statusHistory?.find(h => h.status === step.key);

              return (
                <div key={step.key} className="flex items-start space-x-4">
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 pt-2">
                    <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {historyItem && (
                      <p className="text-sm text-gray-500">{formatDate(historyItem.timestamp)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery Partner Info */}
      {order.deliveryPartner?.name && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800">Delivery Partner</h4>
          <p className="text-green-700">{order.deliveryPartner.name}</p>
          <p className="text-green-700">{order.deliveryPartner.phone}</p>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
