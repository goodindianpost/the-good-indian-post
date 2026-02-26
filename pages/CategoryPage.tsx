import React from 'react';
import { useParams } from 'react-router-dom';
import { useArticlesByCategory, useTrendingArticles } from '../src/hooks/useArticles';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const categorySlug = (categoryName || '').toLowerCase().replace(/\s+/g, '-');
  const { articles, loading } = useArticlesByCategory(categorySlug);
  const { articles: trending } = useTrendingArticles();

  if (loading) {
    return (
      <div className="animate-pulse container mx-auto px-6 py-20 max-w-screen-xl">
        <div className="h-10 w-48 bg-gray-200 rounded mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/2] bg-gray-200 rounded mb-4" />
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-1/2 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Get category info from first article or use param
  const categoryDisplayName = articles[0]?.category?.name || categoryName;
  const categoryDescription = articles[0]?.category?.description;

  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 text-center max-w-screen-xl">
        <h1 className="text-3xl font-display font-bold tracking-tight text-brand-black mb-4">{categoryDisplayName}</h1>
        <p className="text-lg text-gray-medium font-serif">No articles found in this category yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-screen-xl py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* Main Content */}
        <div className="lg:col-span-8">
          <header className="mb-6 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-brand-black mb-2 md:mb-3">{categoryDisplayName}</h1>
            {categoryDescription && (
              <p className="text-base md:text-lg text-gray-dark font-serif">
                {categoryDescription}
              </p>
            )}
          </header>

          <div className="flex flex-col gap-6 md:gap-10">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" showDescription />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 lg:border-l lg:border-border lg:pl-8">
          <div className="sticky top-24">
            {trending.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={16} className="text-brand-red" />
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-brand-red">Trending Now</h3>
                </div>
                <div className="flex flex-col">
                  {trending.slice(0, 5).map((article, i) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.slug}`}
                      className={`group block py-4 ${i > 0 ? 'border-t border-gray-200' : ''}`}
                    >
                      <span className="inline-flex items-center gap-1.5 font-display text-sm font-medium text-gray-800 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                        {typeof article.category === 'object' ? article.category?.name : article.category}
                      </span>
                      <h4 className="font-display text-base font-semibold leading-snug tracking-tight text-brand-black group-hover:text-brand-red transition-colors">
                        {article.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default CategoryPage;
