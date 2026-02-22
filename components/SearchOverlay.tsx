import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { useSearch } from '../src/hooks/useSearch';
import { useTrendingArticles } from '../src/hooks/useArticles';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, loading } = useSearch(query);
  const { articles: trending } = useTrendingArticles();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasQuery = query.length >= 2;
  const showTrending = !hasQuery && trending.length > 0;
  const showNoResults = hasQuery && !loading && results.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div
        className="relative bg-white w-full max-w-2xl mx-3 sm:mx-4 shadow-2xl max-h-[75vh] sm:max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 text-base sm:text-lg font-display text-brand-black placeholder:text-gray-300 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-brand-black transition-colors flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Results area */}
        <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">

          {loading && (
            <p className="text-sm text-gray-400 uppercase tracking-widest">Searching...</p>
          )}

          {hasQuery && !loading && results.length > 0 && (
            <div>
              <p className="text-xs font-display font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
              <div className="flex flex-col">
                {results.map((article, i) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    onClick={onClose}
                    className={`group flex gap-4 py-4 ${i > 0 ? 'border-t border-gray-200' : ''}`}
                  >
                    {article.cover_image && (
                      <div className="w-24 h-16 flex-shrink-0 bg-gray-100 overflow-hidden">
                        <img src={article.cover_image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center gap-1.5 font-display text-xs font-medium text-gray-500 mb-1">
                        <span className="w-1 h-1 rounded-full bg-brand-red" />
                        {article.category?.name}
                      </span>
                      <h3 className="font-display text-base font-semibold tracking-tight leading-snug text-brand-black group-hover:text-brand-red transition-colors">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {showNoResults && (
            <div className="text-center py-10">
              <p className="font-display text-lg text-gray-400 mb-1">No articles found</p>
              <p className="text-sm text-gray-400">Try a different search term</p>
            </div>
          )}

          {showTrending && (
            <div>
              <p className="text-xs font-display font-semibold text-gray-400 uppercase tracking-wider mb-4">Trending</p>
              <div className="flex flex-col">
                {trending.map((article, i) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    onClick={onClose}
                    className={`group block py-3 ${i > 0 ? 'border-t border-gray-200' : ''}`}
                  >
                    <span className="inline-flex items-center gap-1.5 font-display text-xs font-medium text-gray-500 mb-1">
                      <span className="w-1 h-1 rounded-full bg-brand-red" />
                      {typeof article.category === 'object' ? article.category?.name : article.category}
                    </span>
                    <h4 className="font-display text-base font-semibold tracking-tight leading-snug text-brand-black group-hover:text-brand-red transition-colors">
                      {article.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
