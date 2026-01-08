import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [uniformItems, setUniformItems] = useState({});
  const [foodItems, setFoodItems] = useState({});
  const [products, setProducts] = useState([]);

  // Fetch products for price calculation
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch products for cart');
      }
    };
    fetchProducts();
  }, []);

  const updateUniformItem = (key, data) => {
    setUniformItems(prev => ({
      ...prev,
      [key]: { ...prev[key], ...data }
    }));
  };

  const updateFoodItem = (key, data) => {
    setFoodItems(prev => ({
      ...prev,
      [key]: { ...prev[key], ...data }
    }));
  };

  const calculateTotal = () => {
    let total = 0;

    // Calculate uniform items total
    Object.entries(uniformItems).forEach(([key, item]) => {
      if (item.selected) {
        const product = products.find(p => p._id === key);
        if (product) {
          const quantity = item.quantity || 1;
          total += product.price * quantity;
        }
      }
    });

    // Calculate food items total
    Object.entries(foodItems).forEach(([key, item]) => {
      if (item.selected) {
        const product = products.find(p => p._id === key);
        if (product) {
          const quantity = item.quantity || 1;
          total += product.price * quantity;
        }
      }
    });

    return total;
  };

  const clearCart = () => {
    setUniformItems({});
    setFoodItems({});
  };

  const getOrderData = () => {
    // Convert to order format with product details
    const uniformOrderItems = {};
    const foodOrderItems = {};

    Object.entries(uniformItems).forEach(([key, item]) => {
      if (item.selected) {
        const product = products.find(p => p._id === key);
        if (product) {
          uniformOrderItems[product.itemName] = {
            selected: true,
            productId: key,
            size: item.size,
            quantity: item.quantity || 1,
            price: product.price
          };
        }
      }
    });

    Object.entries(foodItems).forEach(([key, item]) => {
      if (item.selected) {
        const product = products.find(p => p._id === key);
        if (product) {
          foodOrderItems[product.itemName] = {
            selected: true,
            productId: key,
            quantity: item.quantity || 1,
            price: product.price
          };
        }
      }
    });

    return {
      uniformItems: uniformOrderItems,
      foodItems: foodOrderItems,
      totalAmount: calculateTotal()
    };
  };

  const getSelectedItems = () => {
    const selected = [];

    Object.entries(uniformItems).forEach(([key, item]) => {
      if (item.selected) {
        const product = products.find(p => p._id === key);
        if (product) {
          selected.push({
            ...product,
            ...item,
            subtotal: product.price * (item.quantity || 1)
          });
        }
      }
    });

    Object.entries(foodItems).forEach(([key, item]) => {
      if (item.selected) {
        const product = products.find(p => p._id === key);
        if (product) {
          selected.push({
            ...product,
            ...item,
            subtotal: product.price * (item.quantity || 1)
          });
        }
      }
    });

    return selected;
  };

  return (
    <CartContext.Provider value={{
      uniformItems,
      foodItems,
      products,
      updateUniformItem,
      updateFoodItem,
      calculateTotal,
      clearCart,
      getOrderData,
      getSelectedItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
