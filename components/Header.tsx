import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { Category } from '../types';
import SearchOverlay from './SearchOverlay';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const categories = Object.values(Category);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  return (
    <>
      <header className="relative z-40 bg-white">
        {/* Top Row: Menu | Logo | Actions */}
        <div className="container mx-auto px-4 sm:px-6 max-w-screen-xl">
          <div className="flex items-center justify-between py-5 md:py-8 lg:py-10">

            {/* Left - Menu toggle (mobile & desktop) */}
            <button onClick={() => setIsMenuOpen(true)} className="p-1 text-brand-black">
              <Menu size={22} />
            </button>

            {/* Center - Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <img src="/images/logo.png" alt="The Good Indian Post" className="h-12 sm:h-16 md:h-20 lg:h-24" />
            </Link>

            {/* Right - Search */}
            <button onClick={() => setIsSearchOpen(true)} className="bg-white text-brand-black border border-brand-black p-2.5 hover:bg-brand-black hover:text-white transition-colors">
              <Search size={16} />
            </button>

          </div>
        </div>

        {/* Bottom Row: Category Nav (desktop) */}
        <nav className="hidden md:block border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 max-w-screen-xl">
            <div className="flex items-center justify-center gap-10 py-3">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${cat}`}
                  className="font-display text-sm text-gray-700 hover:text-brand-red transition-colors whitespace-nowrap"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-b border-gray-200" />
        </nav>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Drawer Menu */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 sm:w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out font-display ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-6 py-5 flex justify-between items-center border-b border-gray-200">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img src="/images/logo.png" alt="The Good Indian Post" className="h-8" />
          </Link>
          <button onClick={() => setIsMenuOpen(false)} className="p-1 text-brand-black">
            <X size={22} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-6 py-8">
          <nav className="space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat}`}
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg font-bold text-brand-black py-3 border-b border-gray-100 hover:text-brand-red transition-colors"
              >
                {cat}
              </Link>
            ))}
          </nav>

          <div className="mt-10 pt-6 border-t border-gray-200 space-y-4">
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-sm font-semibold text-gray-500 uppercase tracking-wide hover:text-brand-black transition-colors">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
