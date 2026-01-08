import { useState, useEffect } from 'react';
import { FiSearch, FiMessageSquare, FiEye, FiSend, FiCheck, FiX, FiClock, FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { formatDate } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filters, setFilters] = useState({ status: '', type: '', search: '' });
  const [unreadCount, setUnreadCount] = useState(0);

  const messageTypes = [
    { value: '', label: 'All Types' },
    { value: 'general', label: 'General' },
    { value: 'order_request', label: 'Order Request' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
    { value: 'replied', label: 'Replied' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/messages/admin/all?${params}`);
      setMessages(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filters]);

  const handleMarkAsRead = async (messageId) => {
    try {
      await api.put(`/messages/admin/${messageId}/read`);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      await api.put(`/messages/admin/${selectedMessage._id}/reply`, { reply: replyText });
      toast.success('Reply sent successfully');
      setReplyText('');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const handleUpdateStatus = async (messageId, status) => {
    try {
      await api.put(`/messages/admin/${messageId}/status`, { status });
      toast.success('Status updated');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const viewMessage = async (message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      await handleMarkAsRead(message._id);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      unread: 'bg-yellow-100 text-yellow-800',
      read: 'bg-blue-100 text-blue-800',
      replied: 'bg-green-100 text-green-800',
      resolved: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || styles.unread;
  };

  const getTypeBadge = (type) => {
    const styles = {
      general: 'bg-blue-100 text-blue-800',
      order_request: 'bg-purple-100 text-purple-800',
      complaint: 'bg-red-100 text-red-800',
      feedback: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return styles[type] || styles.general;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats */}
      {unreadCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center space-x-2 text-yellow-700">
            <FiMessageSquare />
            <span className="font-medium">{unreadCount} unread message(s)</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="input-field pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          <select
            className="input-field sm:w-36"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            {statusOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            className="input-field sm:w-36"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            {messageTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="card text-center py-12">
            <FiMessageSquare className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">No messages found</h3>
          </div>
        ) : (
          messages.map(msg => (
            <div 
              key={msg._id} 
              className={`card cursor-pointer hover:shadow-md transition-shadow ${
                msg.status === 'unread' ? 'border-l-4 border-l-yellow-500' : ''
              }`}
              onClick={() => viewMessage(msg)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-sm sm:text-base truncate">
                      {msg.subject || 'No Subject'}
                    </span>
                    <span className={`badge ${getStatusBadge(msg.status)}`}>
                      {msg.status}
                    </span>
                    <span className={`badge ${getTypeBadge(msg.type)}`}>
                      {msg.type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-500 mb-2">
                    <span className="flex items-center">
                      <FiUser className="mr-1" size={12} />
                      {msg.senderDetails?.name}
                    </span>
                    <span>{msg.senderDetails?.regimentNo}</span>
                    <span className="flex items-center">
                      <FiClock className="mr-1" size={12} />
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{msg.message}</p>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded self-start"
                  onClick={(e) => { e.stopPropagation(); viewMessage(msg); }}
                >
                  <FiEye size={18} />
                </button>
              </div>
              {msg.orderId && (
                <div className="mt-2 pt-2 border-t">
                  <span className="text-xs text-gray-500">
                    Related Order: <span className="font-mono">{msg.orderId.orderNumber}</span>
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-3 sm:p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <div className="flex items-center space-x-2">
                <FiMessageSquare className="text-primary-500" />
                <h3 className="text-base sm:text-lg font-bold">Message Details</h3>
              </div>
              <button 
                onClick={() => setSelectedMessage(null)} 
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-3 sm:p-4 space-y-4">
              {/* Sender Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Sender Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Name:</span> {selectedMessage.senderDetails?.name}</div>
                  <div><span className="text-gray-500">Regiment:</span> {selectedMessage.senderDetails?.regimentNo}</div>
                  <div><span className="text-gray-500">Phone:</span> {selectedMessage.senderDetails?.phoneNo}</div>
                  <div><span className="text-gray-500">Room:</span> {selectedMessage.senderDetails?.roomNo}</div>
                  <div><span className="text-gray-500">Group:</span> {selectedMessage.senderDetails?.group}</div>
                  <div><span className="text-gray-500">Sent:</span> {formatDate(selectedMessage.createdAt)}</div>
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">{selectedMessage.subject || 'No Subject'}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`badge ${getStatusBadge(selectedMessage.status)}`}>
                      {selectedMessage.status}
                    </span>
                    <span className={`badge ${getTypeBadge(selectedMessage.type)}`}>
                      {selectedMessage.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Previous Reply */}
              {selectedMessage.adminReply?.message && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                    <FiCheck className="mr-1" /> Your Previous Reply
                  </h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.adminReply.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatDate(selectedMessage.adminReply.repliedAt)}</p>
                  </div>
                </div>
              )}

              {/* Reply Section */}
              {selectedMessage.status !== 'resolved' && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Send Reply</h4>
                  <textarea
                    className="input-field min-h-[100px] resize-none"
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <button
                      className="btn-primary flex-1 flex items-center justify-center"
                      onClick={handleReply}
                    >
                      <FiSend className="mr-2" /> Send Reply
                    </button>
                    <button
                      className="btn-outline flex-1"
                      onClick={() => handleUpdateStatus(selectedMessage._id, 'resolved')}
                    >
                      Mark as Resolved
                    </button>
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Update Status</h4>
                <select
                  className="input-field"
                  value={selectedMessage.status}
                  onChange={(e) => {
                    handleUpdateStatus(selectedMessage._id, e.target.value);
                    setSelectedMessage({ ...selectedMessage, status: e.target.value });
                  }}
                >
                  {statusOptions.filter(s => s.value).map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
