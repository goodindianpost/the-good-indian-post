import React from 'react';
import { Link } from 'react-router-dom';
import { ArticleData, normalizeArticle } from './types';

const FeaturedCard: React.FC<{ article: ArticleData }> = ({ article }) => {
  const { categoryName, imageUrl, authorName, publishDate } = normalizeArticle(article);

  return (
    <Link to={`/article/${article.slug}`} className="group block h-full">
      <div className="relative aspect-[16/10] w-full bg-gray-100 mb-5 overflow-hidden">
        {imageUrl && (
          <img src={imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center gap-1.5 font-display text-sm font-medium text-gray-800">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
          {categoryName}
        </span>
        <span className="text-sm text-gray-400">{publishDate ? new Date(publishDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-3 group-hover:text-brand-red transition-colors duration-200">{article.title}</h2>
      {article.excerpt && (
        <p className="text-lg text-gray-500 leading-relaxed mb-3 line-clamp-2">{article.excerpt}</p>
      )}
      <span className="text-sm font-semibold uppercase tracking-wide text-gray-400">{authorName}</span>
    </Link>
  );
};

export default FeaturedCard;
