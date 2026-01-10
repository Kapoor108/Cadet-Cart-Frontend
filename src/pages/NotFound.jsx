import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl sm:text-8xl font-bold text-primary-500 mb-4">404</h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <FiHome />
            <span>Go Home</span>
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn-outline flex items-center justify-center space-x-2"
          >
            <FiArrowLeft />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;