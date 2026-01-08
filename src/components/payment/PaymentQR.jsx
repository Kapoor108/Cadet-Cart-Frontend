import { useState } from 'react';
import { FiUpload, FiCheck, FiSmartphone } from 'react-icons/fi';
import { formatCurrency } from '../../utils/constants';

const PaymentQR = ({ order, onUpload, loading }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="card text-center">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Complete Payment</h3>
        <p className="text-gray-600 mb-2 text-sm sm:text-base">
          Scan the QR code below to pay{' '}
          <span className="font-bold text-primary-500 text-lg sm:text-xl">{formatCurrency(order.totalAmount)}</span>
        </p>
        <div className="flex items-center justify-center space-x-1 mb-4">
          <span className="text-green-600 font-medium text-sm">🚚 Free Delivery Included</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 text-sm">No extra charges</span>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {/* Static GPay QR Code Image */}
          <div className="bg-blue-50 p-3 sm:p-4 rounded-2xl">
            <img 
              src="/gpay-qr.jpg" 
              alt="GPay Payment QR Code" 
              className="w-56 h-56 sm:w-72 sm:h-72 object-contain"
            />
          </div>
          
          <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 sm:px-4 py-2 rounded-full">
            <FiSmartphone />
            <span className="text-xs sm:text-sm font-medium">Scan with any UPI app</span>
          </div>

          <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-3 sm:p-4 rounded-lg w-full max-w-sm">
            <p className="font-medium text-gray-800 mb-2">Payment Instructions:</p>
            <ol className="text-left space-y-1 list-decimal list-inside">
              <li>Open GPay, PhonePe, or any UPI app</li>
              <li>Scan the QR code above</li>
              <li>Enter amount: <span className="font-bold">{formatCurrency(order.totalAmount)}</span></li>
              <li>Complete the payment</li>
              <li>Take a screenshot of confirmation</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="card">
        <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Upload Payment Screenshot</h4>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          After completing the payment, upload a screenshot as proof.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-primary-500 transition-colors">
          {preview ? (
            <div className="space-y-3 sm:space-y-4">
              <img src={preview} alt="Preview" className="max-h-40 sm:max-h-48 mx-auto rounded-lg shadow-md" />
              <p className="text-xs sm:text-sm text-green-600 flex items-center justify-center">
                <FiCheck className="mr-2" /> {file.name}
              </p>
              <button
                className="text-xs sm:text-sm text-primary-500 hover:underline"
                onClick={() => { setFile(null); setPreview(null); }}
              >
                Choose different file
              </button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <FiUpload className="mx-auto text-3xl sm:text-4xl text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium text-sm sm:text-base">Click to upload screenshot</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG (max 5MB)</p>
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        <button
          className="btn-primary w-full mt-4"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? 'Uploading...' : 'Submit Payment Proof'}
        </button>
      </div>

      <div className="text-center text-xs sm:text-sm text-gray-500">
        <p>Having trouble? Contact support@cadetcart.com</p>
      </div>
    </div>
  );
};

export default PaymentQR;
