import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-primary-700 text-white py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold text-secondary-500 mb-3 sm:mb-4">Cadet Cart</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your one-stop shop for NCC uniforms and essentials. Serving cadets with pride and free delivery.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/shop" className="hover:text-secondary-500 transition-colors">Shop Now</a></li>
              <li><a href="/my-orders" className="hover:text-secondary-500 transition-colors">Track Order</a></li>
              <li><a href="/profile" className="hover:text-secondary-500 transition-colors">My Account</a></li>
              <li><a href="/contact" className="hover:text-secondary-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start space-x-2">
                <FiMail size={14} className="mt-0.5 flex-shrink-0" />
                <span className="break-all">cadetcart1@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone size={14} className="flex-shrink-0" />
                <span>+91 7973725213</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiMapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span>GNDEC, Punjab, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-600 mt-6 sm:mt-8 pt-4 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Cadet Cart. All rights reserved. Made with ❤️ for NCC Cadets</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
