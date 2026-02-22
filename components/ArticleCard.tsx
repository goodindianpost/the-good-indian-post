import React from 'react';
import { ArticleData } from './cards/types';
import FeaturedCard from './cards/FeaturedCard';
import StandardCard from './cards/StandardCard';
import HorizontalCard from './cards/HorizontalCard';
import MinimalCard from './cards/MinimalCard';

interface ArticleCardProps {
  article: ArticleData;
  variant?: 'featured' | 'standard' | 'horizontal' | 'minimal';
  showDescription?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'standard', showDescription }) => {
  switch (variant) {
    case 'featured':
      return <FeaturedCard article={article} />;
    case 'horizontal':
      return <HorizontalCard article={article} showDescription={showDescription} />;
    case 'minimal':
      return <MinimalCard article={article} />;
    default:
      return <StandardCard article={article} />;
  }
};

export default ArticleCard;
