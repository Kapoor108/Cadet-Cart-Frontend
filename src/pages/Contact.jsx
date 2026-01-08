import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiSend, FiMessageCircle, FiClock, FiCheckCircle, FiMail, FiArrowLeft } from 'react-icons/fi';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate } from '../utils/constants';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    type: 'general'
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('send');

  const messageTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'order_request', label: 'Order Request' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' }
  ];

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages/my-messages');
      setMessages(response.data.data);
    } catch (error) {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    try {
      await api.post('/messages', formData);
      toast.success('Message sent successfully!');
      setFormData({ subject: '', message: '', type: 'general' });
      fetchMessages();
      setActiveTab('history');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
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

  if (loading) return <LoadingSpinner />;

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

      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Contact Admin</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base ${
            activeTab === 'send' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('send')}
        >
          <FiSend className="inline mr-2" />
          Send Message
        </button>
        <button
          className={`px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base ${
            activeTab === 'history' ? 'border-b-2 border-primary-500 text-primary-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('history')}
        >
          <FiMessageCircle className="inline mr-2" />
          My Messages ({messages.length})
        </button>
      </div>

      {/* Send Message Form */}
      {activeTab === 'send' && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <FiMail className="text-primary-500 text-xl" />
            <h2 className="text-lg font-semibold">Send a Message</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Have a question, request, or feedback? Send us a message and we'll get back to you soon.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Message Type</label>
              <select
                className="input-field"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {messageTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject (Optional)</label>
              <input
                type="text"
                className="input-field"
                placeholder="Brief subject of your message"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message *</label>
              <textarea
                className="input-field min-h-[150px] resize-none"
                placeholder="Write your message here... You can request items, ask questions, give feedback, or anything else."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                maxLength={1000}
                required
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{formData.message.length}/1000</p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
              disabled={sending}
            >
              <FiSend className="mr-2" />
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      )}

      {/* Message History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="card text-center py-12">
              <FiMessageCircle className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No messages yet</h3>
              <p className="text-gray-500 text-sm mb-4">Send your first message to the admin</p>
              <button
                className="btn-primary"
                onClick={() => setActiveTab('send')}
              >
                Send Message
              </button>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg._id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium text-sm sm:text-base">{msg.subject || 'No Subject'}</span>
                      <span className={`badge ${getStatusBadge(msg.status)}`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center">
                      <FiClock className="mr-1" size={12} />
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                  <span className="badge badge-info text-xs">{msg.type.replace('_', ' ')}</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                </div>

                {msg.adminReply?.message && (
                  <div className="border-t pt-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiCheckCircle className="text-green-500" size={16} />
                      <span className="text-sm font-medium text-green-700">Admin Reply</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(msg.adminReply.repliedAt)}
                      </span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.adminReply.message}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Contact;
