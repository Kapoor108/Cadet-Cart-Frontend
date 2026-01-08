import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './useAuth';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { socket } = useAuth();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = async (orderData) => {
    const response = await api.post('/orders', orderData);
    setOrders(prev => [response.data.data, ...prev]);
    return response.data;
  };

  const uploadPayment = async (orderId, file) => {
    const formData = new FormData();
    formData.append('screenshot', file);
    const response = await api.put(`/orders/${orderId}/payment`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setOrders(prev => prev.map(o => o._id === orderId ? response.data.data : o));
    return response.data;
  };

  const cancelOrder = async (orderId) => {
    const response = await api.delete(`/orders/${orderId}`);
    setOrders(prev => prev.filter(o => o._id !== orderId));
    return response.data;
  };

  const trackOrder = async (orderId) => {
    const response = await api.get(`/orders/${orderId}/track`);
    return response.data;
  };

  useEffect(() => {
    if (socket) {
      socket.on('orderStatusUpdate', ({ orderId, status }) => {
        setOrders(prev => prev.map(o => 
          o._id === orderId ? { ...o, orderStatus: status } : o
        ));
      });

      socket.on('deliveryAssigned', ({ orderId, deliveryPartner }) => {
        setOrders(prev => prev.map(o => 
          o._id === orderId ? { ...o, deliveryPartner, orderStatus: 'out_for_delivery' } : o
        ));
      });
    }

    return () => {
      if (socket) {
        socket.off('orderStatusUpdate');
        socket.off('deliveryAssigned');
      }
    };
  }, [socket]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    uploadPayment,
    cancelOrder,
    trackOrder
  };
};
