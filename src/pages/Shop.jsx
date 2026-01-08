import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import OrderForm from '../components/order/OrderForm';
import OrderSummary from '../components/order/OrderSummary';
import PaymentQR from '../components/payment/PaymentQR';
import PaymentSuccess from '../components/payment/PaymentSuccess';

const Shop = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const { getOrderData, clearCart } = useCart();
  const { createOrder, uploadPayment } = useOrders();

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const orderData = getOrderData();
      orderData.specialRequests = specialRequests;
      const response = await createOrder(orderData);
      setCurrentOrder(response.data);
      setStep(3);
      toast.success('Order created! Please complete payment.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpload = async (file) => {
    setLoading(true);
    try {
      const response = await uploadPayment(currentOrder._id, file);
      setCurrentOrder(response.data);
      clearCart();
      setSpecialRequests('');
      setStep(4);
      toast.success('Payment proof uploaded!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload payment');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Select Items' },
    { num: 2, label: 'Review Order' },
    { num: 3, label: 'Payment' },
    { num: 4, label: 'Complete' }
  ];

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

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 overflow-x-auto pb-2">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center flex-shrink-0">
            <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-semibold text-sm sm:text-base ${
              step >= s.num ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s.num}
            </div>
            <span className={`ml-1 sm:ml-2 text-xs sm:text-base hidden xs:block ${step >= s.num ? 'text-primary-500' : 'text-gray-400'}`}>
              {s.label}
            </span>
            {idx < steps.length - 1 && (
              <div className={`w-6 sm:w-12 md:w-24 h-1 mx-1 sm:mx-2 ${step > s.num ? 'bg-primary-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <OrderForm 
          onNext={() => setStep(2)} 
          specialRequests={specialRequests}
          setSpecialRequests={setSpecialRequests}
        />
      )}
      {step === 2 && (
        <OrderSummary
          onBack={() => setStep(1)}
          onConfirm={handleCreateOrder}
          loading={loading}
          specialRequests={specialRequests}
        />
      )}
      {step === 3 && currentOrder && (
        <PaymentQR
          order={currentOrder}
          onUpload={handlePaymentUpload}
          loading={loading}
        />
      )}
      {step === 4 && currentOrder && <PaymentSuccess order={currentOrder} />}
    </div>
  );
};

export default Shop;
