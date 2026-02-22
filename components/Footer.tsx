import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

const Footer: React.FC = () => {
  const categories = Object.values(Category);

  return (
    <footer className="bg-gray-50">
      <div className="container mx-auto px-6 max-w-screen-xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <Link to="/" className="block mb-2">
              <img src="/images/logo.png" alt="The Good Indian Post" className="h-10" />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Stories from India and the diaspora.
            </p>
          </div>

          {/* Sections */}
          <div>
            <h4 className="font-display text-xs font-semibold text-gray-400 mb-3">Sections</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link to={`/category/${cat}`} className="font-display text-sm text-gray-600 hover:text-brand-black transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-xs font-semibold text-gray-400 mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="font-display text-sm text-gray-600 hover:text-brand-black transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="font-display text-sm text-gray-600 hover:text-brand-black transition-colors">Contact</Link></li>
              <li><Link to="/support" className="font-display text-sm text-gray-600 hover:text-brand-black transition-colors">Advertise</Link></li>
              <li><Link to="/support" className="font-display text-sm text-gray-600 hover:text-brand-black transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-display text-xs font-semibold text-gray-400 mb-3">Follow Us</h4>
            <ul className="space-y-2">
              <li><a href="#" className="font-display text-sm text-gray-600 hover:text-brand-black transition-colors">Twitter / X</a></li>
              <li><a href="#" className="font-display text-sm text-gray-600 hover:text-brand-black transition-colors">Instagram</a></li>
              <li><a href="#" className="font-display text-sm text-gray-600 hover:text-brand-black transition-colors">LinkedIn</a></li>
              <li><a href="#" className="font-display text-sm text-gray-600 hover:text-brand-black transition-colors">YouTube</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-6 max-w-screen-xl py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-400">
            <p>&copy; {new Date().getFullYear()} The Good Indian Post. All rights reserved.</p>
            <div className="flex gap-5">
              <Link to="/" className="hover:text-brand-black transition-colors">Privacy</Link>
              <Link to="/" className="hover:text-brand-black transition-colors">Terms</Link>
              <Link to="/" className="hover:text-brand-black transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
