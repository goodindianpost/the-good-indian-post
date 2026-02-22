import React from 'react';
import { Link } from 'react-router-dom';
import { ArticleData, normalizeArticle, getContentPreview } from './types';

const HorizontalCard: React.FC<{ article: ArticleData; showDescription?: boolean }> = ({ article, showDescription }) => {
  const { categoryName, imageUrl, publishDate } = normalizeArticle(article);
  const description = showDescription ? getContentPreview(article.content) : '';

  return (
    <Link to={`/article/${article.slug}`} className="group flex gap-5">
      <div className="w-52 aspect-[4/3] flex-shrink-0 bg-gray-100 overflow-hidden">
        {imageUrl && <img src={imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
        <span className="inline-flex items-center gap-1.5 font-display text-sm font-medium text-gray-800 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
          {categoryName}
        </span>
        <h3 className="font-display text-xl font-semibold tracking-tight leading-snug group-hover:text-brand-red transition-colors duration-200 line-clamp-2">{article.title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{description}</p>
        )}
        <span className="text-sm text-gray-400 mt-1.5 block">{publishDate ? new Date(publishDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}</span>
      </div>
    </Link>
  );
};

export default HorizontalCard;
