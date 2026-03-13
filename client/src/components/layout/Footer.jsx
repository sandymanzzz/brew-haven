import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-espresso text-cream-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brew-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">☕</span>
              </div>
              <div>
                <div className="font-display text-xl font-bold text-cream-100">Brew Haven</div>
                <div className="font-accent text-xs text-brew-400">Café & Bakery</div>
              </div>
            </div>
            <p className="text-sm text-cream-400 leading-relaxed max-w-xs">
              A cozy corner in the city where every cup tells a story. We source the finest beans and bake everything fresh daily.
            </p>
            <div className="flex gap-3 mt-4">
              {['📘','📸','🐦','▶️'].map((icon, i) => (
                <button key={i} className="w-8 h-8 bg-brew-900 rounded-full flex items-center justify-center hover:bg-brew-700 transition-colors text-sm">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-cream-100 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/menu', 'Our Menu'], ['/cart', 'Cart'], ['/wishlist', 'Wishlist']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-cream-400 hover:text-brew-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-cream-100 mb-4">Visit Us</h4>
            <ul className="space-y-2 text-sm text-cream-400">
              <li className="flex items-start gap-2"><span>📍</span><span>123 Bean Street, Coffee District, CA 90210</span></li>
              <li className="flex items-center gap-2"><span>📞</span><span>+1 (555) BREW-HAVEN</span></li>
              <li className="flex items-center gap-2"><span>✉️</span><span>hello@brewhaven.com</span></li>
              <li className="flex items-center gap-2"><span>🕐</span><span>Mon–Sun: 7am – 9pm</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brew-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream-500">© {new Date().getFullYear()} Brew Haven Café. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-cream-500">
            <span className="hover:text-brew-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-brew-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-brew-400 cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
