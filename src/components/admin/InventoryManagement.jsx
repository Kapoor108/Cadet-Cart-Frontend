import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiPackage, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { formatCurrency } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    category: 'uniform',
    itemName: '',
    price: '',
    stockQuantity: 100,
    sizes: '',
    description: ''
  });

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      if (stockFilter) params.append('inStock', stockFilter);

      const response = await api.get(`/admin/products?${params}`);
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, stockFilter]);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        category: product.category,
        itemName: product.itemName,
        price: product.price,
        stockQuantity: product.stockQuantity,
        sizes: product.sizes?.join(', ') || '',
        description: product.description || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        category: 'uniform',
        itemName: '',
        price: '',
        stockQuantity: 100,
        sizes: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
    };

    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post('/admin/products', payload);
        toast.success('Product added successfully');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId, productName) => {
    const confirmMessage = `Are you sure you want to delete product "${productName}"?\n\nThis will:\n• Permanently remove the product from inventory\n• Cannot be undone\n\nType "DELETE" to confirm:`;
    
    const userInput = window.prompt(confirmMessage);
    if (userInput !== 'DELETE') {
      if (userInput !== null) {
        toast.error('Deletion cancelled - you must type "DELETE" to confirm');
      }
      return;
    }

    try {
      await api.delete(`/admin/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleQuickStockUpdate = async (productId, newQuantity) => {
    try {
      await api.put(`/admin/products/${productId}`, { stockQuantity: newQuantity });
      toast.success('Stock updated');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  const handleToggleStock = async (product) => {
    try {
      await api.put(`/admin/products/${product._id}`, { 
        inStock: !product.inStock,
        stockQuantity: product.inStock ? 0 : 100
      });
      toast.success(`Product ${product.inStock ? 'marked out of stock' : 'marked in stock'}`);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update stock status');
    }
  };

  if (loading) return <LoadingSpinner />;

  const lowStockProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10);
  const outOfStockProducts = products.filter(p => !p.inStock || p.stockQuantity === 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {lowStockProducts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 text-yellow-700 mb-1 sm:mb-2">
                <FiAlertCircle size={16} />
                <span className="font-medium text-sm sm:text-base">Low Stock Alert</span>
              </div>
              <p className="text-xs sm:text-sm text-yellow-600">
                {lowStockProducts.length} product(s) have low stock
              </p>
            </div>
          )}
          {outOfStockProducts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2 text-red-700 mb-1 sm:mb-2">
                <FiPackage size={16} />
                <span className="font-medium text-sm sm:text-base">Out of Stock</span>
              </div>
              <p className="text-xs sm:text-sm text-red-600">
                {outOfStockProducts.length} product(s) are out of stock
              </p>
            </div>
          )}
        </div>
      )}

      {/* Filters & Add Button */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
            <div className="relative flex-1 sm:min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="input-field pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 sm:gap-4">
              <select
                className="input-field flex-1 sm:w-32"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Category</option>
                <option value="uniform">Uniform</option>
                <option value="food">Food</option>
              </select>
              <select
                className="input-field flex-1 sm:w-32"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="">Stock</option>
                <option value="true">In Stock</option>
                <option value="false">Out</option>
              </select>
            </div>
          </div>
          <button className="btn-primary flex items-center justify-center space-x-2" onClick={() => handleOpenModal()}>
            <FiPlus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Products Table - Desktop */}
      <div className="card hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-3 text-sm">Product</th>
              <th className="text-left py-3 px-3 text-sm">Category</th>
              <th className="text-left py-3 px-3 text-sm">Price</th>
              <th className="text-left py-3 px-3 text-sm">Stock</th>
              <th className="text-left py-3 px-3 text-sm">Status</th>
              <th className="text-left py-3 px-3 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiPackage className="text-gray-400" size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{product.itemName}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className={`badge ${product.category === 'uniform' ? 'badge-info' : 'badge-success'}`}>
                    {product.category}
                  </span>
                </td>
                <td className="py-3 px-3 font-medium text-sm">{formatCurrency(product.price)}</td>
                <td className="py-3 px-3">
                  <input
                    type="number"
                    min="0"
                    className="input-field w-16 text-center py-1 text-sm"
                    value={product.stockQuantity}
                    onChange={(e) => handleQuickStockUpdate(product._id, parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => handleToggleStock(product)}
                    className={`badge cursor-pointer ${
                      product.inStock && product.stockQuantity > 0
                        ? product.stockQuantity <= 10
                          ? 'badge-pending'
                          : 'badge-success'
                        : 'badge-error'
                    }`}
                  >
                    {!product.inStock || product.stockQuantity === 0
                      ? 'Out'
                      : product.stockQuantity <= 10
                        ? 'Low'
                        : 'In Stock'}
                  </button>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-1">
                    <button
                      className="p-1.5 hover:bg-blue-100 rounded text-blue-600"
                      onClick={() => handleOpenModal(product)}
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      className="p-1.5 hover:bg-red-100 rounded text-red-600"
                      onClick={() => handleDelete(product._id, product.itemName)}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-center py-8 text-gray-500">No products found</p>
        )}
      </div>

      {/* Products Cards - Mobile */}
      <div className="sm:hidden space-y-3">
        {products.map(product => (
          <div key={product._id} className="card">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{product.itemName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge ${product.category === 'uniform' ? 'badge-info' : 'badge-success'}`}>
                    {product.category}
                  </span>
                  <span className="font-medium text-sm">{formatCurrency(product.price)}</span>
                </div>
              </div>
              <button
                onClick={() => handleToggleStock(product)}
                className={`badge cursor-pointer ${
                  product.inStock && product.stockQuantity > 0
                    ? product.stockQuantity <= 10
                      ? 'badge-pending'
                      : 'badge-success'
                    : 'badge-error'
                }`}
              >
                {!product.inStock || product.stockQuantity === 0
                  ? 'Out'
                  : product.stockQuantity <= 10
                    ? 'Low'
                    : 'In Stock'}
              </button>
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Stock:</span>
                <input
                  type="number"
                  min="0"
                  className="input-field w-16 text-center py-1 text-sm"
                  value={product.stockQuantity}
                  onChange={(e) => handleQuickStockUpdate(product._id, parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 bg-blue-50 rounded text-blue-600"
                  onClick={() => handleOpenModal(product)}
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  className="p-2 bg-red-50 rounded text-red-600"
                  onClick={() => handleDelete(product._id, product.itemName)}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="card text-center py-8 text-gray-500">No products found</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 max-h-[95vh] overflow-y-auto">
            <h3 className="text-lg sm:text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={editingProduct}
                >
                  <option value="uniform">Uniform</option>
                  <option value="food">Food</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  required
                  disabled={editingProduct}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sizes (comma separated)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="S, M, L, XL"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="input-field"
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                <button type="button" className="btn-outline flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
