import React from 'react';
import { Link } from 'react-router-dom';
import { ArticleData, normalizeArticle } from './types';

const StandardCard: React.FC<{ article: ArticleData }> = ({ article }) => {
  const { categoryName, imageUrl, publishDate } = normalizeArticle(article);

  return (
    <Link to={`/article/${article.slug}`} className="group block">
      <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden mb-4">
        {imageUrl && <img src={imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
      </div>
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex items-center gap-1.5 font-display text-sm font-medium text-gray-800">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
          {categoryName}
        </span>
        <span className="text-sm text-gray-400">{publishDate ? new Date(publishDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}</span>
      </div>
      <h3 className="font-display text-xl font-semibold tracking-tight leading-snug mb-2 group-hover:text-brand-red transition-colors duration-200 line-clamp-3">{article.title}</h3>
      {article.excerpt && (
        <p className="text-base text-gray-500 leading-relaxed line-clamp-2">{article.excerpt}</p>
      )}
    </Link>
  );
};

export default StandardCard;
