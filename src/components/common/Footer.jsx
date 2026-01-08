import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-primary-700 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-secondary-500 mb-4">Cadet Cart</h3>
            <p className="text-gray-300 text-sm">
              Your one-stop shop for NCC uniforms and essentials. Serving cadets with pride.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/shop" className="hover:text-secondary-500">Shop</a></li>
              <li><a href="/my-orders" className="hover:text-secondary-500">Track Order</a></li>
              <li><a href="/profile" className="hover:text-secondary-500">My Account</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <FiMail size={14} />
                <span>cadetcart1@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone size={14} />
                <span>+91 7973725213</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMapPin size={14} />
                <span>GNDEC, Punjab, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-600 mt-8 pt-4 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Cadet Cart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
