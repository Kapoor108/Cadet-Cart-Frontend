import { useState, useEffect } from 'react';
import { FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { SIZES, SHOE_SIZES, formatCurrency } from '../../utils/constants';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const OrderForm = ({ onNext, specialRequests, setSpecialRequests }) => {
  const { uniformItems, foodItems, updateUniformItem, updateFoodItem, calculateTotal } = useCart();
  const [activeTab, setActiveTab] = useState('uniform');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const uniformProducts = products.filter(p => p.category === 'uniform');
  const foodProducts = products.filter(p => p.category === 'food');

  const handleUniformChange = (key, field, value) => {
    updateUniformItem(key, { [field]: value });
  };

  const handleFoodChange = (key, field, value) => {
    updateFoodItem(key, { [field]: value });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Free Delivery Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">🚚</span>
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold">FREE DELIVERY</h3>
            <p className="text-sm sm:text-base opacity-90">Direct to your room • No delivery charges</p>
          </div>
          <span className="text-2xl">📦</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        <button
          className={`px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base whitespace-nowrap ${activeTab === 'uniform' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('uniform')}
        >
          Uniform ({uniformProducts.filter(p => p.inStock).length})
        </button>
        <button
          className={`px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base whitespace-nowrap ${activeTab === 'food' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('food')}
        >
          Food ({foodProducts.filter(p => p.inStock).length})
        </button>
      </div>

      {/* Uniform Items */}
      {activeTab === 'uniform' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uniformProducts.map(product => {
            const key = product._id;
            const isOutOfStock = !product.inStock || product.stockQuantity === 0;
            const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;

            return (
              <div 
                key={key} 
                className={`card border ${isOutOfStock ? 'opacity-60 bg-gray-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={uniformItems[key]?.selected || false}
                      onChange={(e) => handleUniformChange(key, 'selected', e.target.checked)}
                      className="w-5 h-5 text-primary-500 rounded"
                      disabled={isOutOfStock}
                    />
                    <div>
                      <h4 className="font-medium">{product.itemName}</h4>
                      <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                      {product.description && (
                        <p className="text-xs text-gray-400 mt-1">{product.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {isOutOfStock && (
                      <span className="badge badge-error text-xs">Out of Stock</span>
                    )}
                    {isLowStock && !isOutOfStock && (
                      <span className="badge badge-pending text-xs flex items-center">
                        <FiAlertCircle className="mr-1" size={12} />
                        Only {product.stockQuantity} left
                      </span>
                    )}
                  </div>
                </div>

                {uniformItems[key]?.selected && !isOutOfStock && (
                  <div className="mt-4 space-y-3">
                    {product.sizes?.length > 0 && (
                      <select
                        className="input-field"
                        value={uniformItems[key]?.size || ''}
                        onChange={(e) => handleUniformChange(key, 'size', e.target.value)}
                      >
                        <option value="">Select Size</option>
                        {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}

                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        max={product.stockQuantity}
                        className="input-field w-20"
                        value={uniformItems[key]?.quantity || 1}
                        onChange={(e) => handleUniformChange(key, 'quantity', Math.min(parseInt(e.target.value) || 1, product.stockQuantity))}
                      />
                      {product.stockQuantity < 100 && (
                        <span className="text-xs text-gray-400">(max: {product.stockQuantity})</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {uniformProducts.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No uniform items available
            </div>
          )}
        </div>
      )}

      {/* Food Items */}
      {activeTab === 'food' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {foodProducts.map(product => {
            const key = product._id;
            const isOutOfStock = !product.inStock || product.stockQuantity === 0;
            const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;

            return (
              <div 
                key={key} 
                className={`card border ${isOutOfStock ? 'opacity-60 bg-gray-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={foodItems[key]?.selected || false}
                      onChange={(e) => handleFoodChange(key, 'selected', e.target.checked)}
                      className="w-5 h-5 text-primary-500 rounded"
                      disabled={isOutOfStock}
                    />
                    <div>
                      <h4 className="font-medium">{product.itemName}</h4>
                      <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                      {product.description && (
                        <p className="text-xs text-gray-400 mt-1">{product.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {isOutOfStock && (
                      <span className="badge badge-error text-xs">Out of Stock</span>
                    )}
                    {isLowStock && !isOutOfStock && (
                      <span className="badge badge-pending text-xs flex items-center">
                        <FiAlertCircle className="mr-1" size={12} />
                        Only {product.stockQuantity} left
                      </span>
                    )}
                  </div>
                </div>

                {foodItems[key]?.selected && !isOutOfStock && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        max={product.stockQuantity}
                        className="input-field w-20"
                        value={foodItems[key]?.quantity || 1}
                        onChange={(e) => handleFoodChange(key, 'quantity', Math.min(parseInt(e.target.value) || 1, product.stockQuantity))}
                      />
                      {product.stockQuantity < 100 && (
                        <span className="text-xs text-gray-400">(max: {product.stockQuantity})</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {foodProducts.length === 0 && (
            <div className="col-span-2 text-center py-8 text-gray-500">
              No food items available
            </div>
          )}
        </div>
      )}

      {/* Special Requests / Message Box */}
      <div className="card border border-primary-200 bg-primary-50/30">
        <div className="flex items-center space-x-2 mb-3">
          <FiMessageSquare className="text-primary-500" />
          <h4 className="font-medium text-primary-700">Special Requests / Additional Items</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Need something not listed above? Write your requirements here. 
          <span className="text-primary-600"> For general inquiries without ordering, use the <a href="/contact" className="underline font-medium">Contact Page</a>.</span>
        </p>
        <textarea
          className="input-field min-h-[100px] resize-none"
          placeholder="E.g., I need 2 extra badges, 1 whistle, specific brand preferences, delivery time preference, etc..."
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          maxLength={500}
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{specialRequests.length}/500 characters</p>
      </div>

      {/* Total and Next */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-xl sm:text-2xl font-bold text-primary-500">{formatCurrency(calculateTotal())}</p>
          <div className="flex items-center justify-center sm:justify-start space-x-1 mt-1">
            <span className="text-xs text-green-600 font-medium">🚚 Free Delivery</span>
            {specialRequests && (
              <span className="text-xs text-primary-600">• Special requests included</span>
            )}
          </div>
        </div>
        <button
          className="btn-primary w-full sm:w-auto"
          onClick={onNext}
          disabled={calculateTotal() === 0 && !specialRequests.trim()}
        >
          Continue to Summary
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
