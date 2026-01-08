import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTruck, FiShield, FiClock } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  const features = [
    { icon: FiShoppingBag, title: 'Wide Selection', desc: 'Complete range of NCC uniforms and accessories' },
    { icon: FiTruck, title: 'FREE Delivery', desc: 'Free delivery right to your room - no charges!' },
    { icon: FiShield, title: 'Secure Payment', desc: 'Safe GPay payment with verification' },
    { icon: FiClock, title: 'Real-time Tracking', desc: 'Track your order status live' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            Cadet <span className="text-secondary-500">Cart</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-200 px-4">
            Your one-stop shop for uniforms, accessories & food
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            {user ? (
              <Link to="/shop" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3">
                Start Shopping
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3">
                  Get Started
                </Link>
                <Link to="/login" className="btn-outline border-white text-white hover:bg-white hover:text-primary-500 text-base sm:text-lg px-6 sm:px-8 py-3">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Free Delivery Banner */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl sm:text-4xl">🚚</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">FREE DELIVERY</h3>
                <p className="text-sm sm:text-base opacity-90">Direct to your room</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/30"></div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl sm:text-4xl">⚡</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">FAST & SECURE</h3>
                <p className="text-sm sm:text-base opacity-90">No delivery charges ever</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="card text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <feature.icon className="text-primary-500 text-xl sm:text-2xl" />
                </div>
                <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="relative rounded-xl overflow-hidden h-48 sm:h-64 bg-primary-600 group cursor-pointer">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Uniforms</h3>
                <p className="text-gray-200 text-sm sm:text-base">Berets, Belts, Shoes & More</p>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden h-48 sm:h-64 bg-secondary-600 group cursor-pointer">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Food Items</h3>
                <p className="text-gray-200 text-sm sm:text-base">Noodles, Momos, Burgers & More</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-primary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Order?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-200">
            Join thousands of cadets who trust us for their uniform needs
          </p>
          <Link to={user ? '/shop' : '/register'} className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3">
            {user ? 'Shop Now' : 'Create Account'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
