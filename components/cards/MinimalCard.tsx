import React from 'react';
import { Link } from 'react-router-dom';
import { ArticleData, normalizeArticle } from './types';

const MinimalCard: React.FC<{ article: ArticleData }> = ({ article }) => {
  const { categoryName, categoryColor } = normalizeArticle(article);

  return (
    <Link to={`/article/${article.slug}`} className="group block pl-5 border-l-2 transition-colors duration-200" style={{ borderColor: categoryColor }}>
      <span className="inline-flex items-center gap-1.5 font-display text-sm font-medium text-gray-800 mb-1.5"><span className="w-1.5 h-1.5 rounded-full bg-brand-red" />{categoryName}</span>
      <h3 className="font-display text-xl font-semibold tracking-tight leading-snug group-hover:text-brand-red transition-colors duration-200">{article.title}</h3>
      {article.excerpt && (
        <p className="text-base text-gray-400 mt-1.5 leading-relaxed line-clamp-2">{article.excerpt}</p>
      )}
    </Link>
  );
};

export default MinimalCard;
