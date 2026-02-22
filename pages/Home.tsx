import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import { useArticles, useTrendingArticles } from '../src/hooks/useArticles';

const Home: React.FC = () => {
  const { articles, loading } = useArticles();
  const { articles: trending } = useTrendingArticles();

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse">
        <div className="container mx-auto px-6 max-w-screen-xl py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-6" />
              <div className="h-12 w-full bg-gray-200 rounded mb-3" />
              <div className="h-12 w-3/4 bg-gray-200 rounded mb-6" />
              <div className="h-5 w-full bg-gray-100 rounded mb-2" />
              <div className="h-5 w-2/3 bg-gray-100 rounded" />
            </div>
            <div className="aspect-[4/3] bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const featuredArticles = articles.filter(a => a.featured);
  // Fallback to most recent article if none are featured
  const heroArticles = featuredArticles.length > 0 ? featuredArticles : articles.slice(0, 1);
  const featuredIds = new Set(heroArticles.map(a => a.id));
  const latestStories = articles.filter(a => !featuredIds.has(a.id)).slice(0, 4);

  const getByCategory = (slug: string) => articles.filter(a => a.category?.slug === slug);
  const cultureStories = getByCategory('culture').slice(0, 4);
  const filmStories = getByCategory('film').slice(0, 4);
  const goodIndiansStories = [...getByCategory('good-indians'), ...getByCategory('global-indians')].slice(0, 4);
  const newsStories = getByCategory('news').slice(0, 5);
  const literatureStories = getByCategory('literature').slice(0, 3);

  // Collect IDs already shown above
  const shownIds = new Set([
    ...heroArticles.map(a => a.id),
    ...latestStories.map(a => a.id),
    ...cultureStories.map(a => a.id),
    ...filmStories.map(a => a.id),
    ...goodIndiansStories.map(a => a.id),
    ...newsStories.map(a => a.id),
    ...literatureStories.map(a => a.id),
  ]);
  const moreStories = articles.filter(a => !shownIds.has(a.id)).slice(0, 12);

  if (articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Articles Yet</h1>
          <p className="text-gray-500 mb-6">Create your first article in the admin panel.</p>
          <Link to="/admin" className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors">
            Go to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* ─── HERO ─── */}
      {heroArticles.length > 0 && (
        <HeroCarousel articles={heroArticles} />
      )}

      {/* ─── TRENDING STRIP ─── */}
      {trending.length > 0 && (
        <section className="bg-white border-y border-gray-200">
          <div className="container mx-auto px-6 max-w-screen-xl">
            <div className="flex items-center gap-6 py-3.5">
              <div className="flex items-center gap-2 flex-shrink-0">
                <TrendingUp size={14} className="text-brand-red" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-red">Trending</span>
              </div>
              <div className="w-px h-4 bg-gray-200 flex-shrink-0" />
              <div className="overflow-hidden flex-1">
                <div className="flex animate-marquee">
                  {[0, 1].map((copy) => (
                    <div key={copy} className="flex flex-shrink-0">
                      {trending.map((article, i) => (
                        <React.Fragment key={`${article.id}-${copy}`}>
                          <Link
                            to={`/article/${article.slug}`}
                            className="text-[13px] text-gray-500 hover:text-brand-black transition-colors whitespace-nowrap flex-shrink-0 px-4"
                          >
                            {article.title}
                          </Link>
                          <span className="text-gray-300 flex-shrink-0">/</span>
                        </React.Fragment>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── LATEST STORIES ─── */}
      {latestStories.length > 0 && (
        <section className="bg-white">
          <div className="container mx-auto px-6 max-w-screen-xl pt-16 pb-20">
            <SectionHeader title="Latest Stories" color="#FF1001" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7">
                <ArticleCard article={latestStories[0]} variant="featured" />
              </div>
              <div className="lg:col-span-5 flex flex-col gap-7">
                {latestStories.slice(1, 4).map(article => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── CULTURE ─── */}
      {cultureStories.length > 0 && (
        <section className="bg-white">
          <div className="container mx-auto px-6 max-w-screen-xl pt-16 pb-20">
            <SectionHeader title="Culture" color="#FF1001" href="/category/culture" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {cultureStories.map(article => <ArticleCard key={article.id} article={article} variant="standard" />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── GOOD INDIANS + GLOBAL INDIANS ─── */}
      {goodIndiansStories.length > 0 && (
        <section className="bg-white">
          <div className="container mx-auto px-6 max-w-screen-xl pt-16 pb-20">
            <SectionHeader title="Good Indians" color="#FF1001" href="/category/good-indians" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7">
                <ArticleCard article={goodIndiansStories[0]} variant="featured" />
              </div>
              <div className="lg:col-span-5 flex flex-col gap-7">
                {goodIndiansStories.slice(1, 4).map(article => <ArticleCard key={article.id} article={article} variant="horizontal" />)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── NEWS & POLITICS ─── */}
      {newsStories.length > 0 && (
        <section className="bg-white">
          <div className="container mx-auto px-6 max-w-screen-xl pt-16 pb-20">
            <SectionHeader title="News & Politics" color="#FF1001" href="/category/news" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8">
                <ArticleCard article={newsStories[0]} variant="featured" />
              </div>
              <div className="lg:col-span-4 flex flex-col gap-0">
                {newsStories.slice(1, 5).map((article, i) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    className={`group block py-5 ${i > 0 ? 'border-t border-gray-200' : ''}`}
                  >
                    <span className="text-sm text-gray-400 block mb-1.5">
                      {article.published_at && new Date(article.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <h4 className="font-display text-xl font-semibold tracking-tight leading-snug text-brand-black group-hover:text-brand-red transition-colors duration-200">{article.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── FILM ─── */}
      {filmStories.length > 0 && (
        <section className="bg-white">
          <div className="container mx-auto px-6 max-w-screen-xl pt-16 pb-20">
            <SectionHeader title="Film" color="#FF1001" href="/category/film" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {filmStories.map(article => <ArticleCard key={article.id} article={article} variant="standard" />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── LITERATURE ─── */}
      {literatureStories.length > 0 && (
        <section className="bg-white">
          <div className="container mx-auto px-6 max-w-screen-xl pt-16 pb-20">
            <SectionHeader title="Literature" color="#FF1001" href="/category/literature" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {literatureStories.map((article, i) => (
                <Link key={article.id} to={`/article/${article.slug}`} className="group flex flex-col">
                  <span className="inline-flex items-center gap-1.5 font-display text-sm font-medium text-gray-800 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                    {typeof article.category === 'object' ? article.category?.name : article.category}
                  </span>
                  <h3 className="font-display text-2xl font-bold tracking-tight leading-snug text-brand-black mb-3 group-hover:text-brand-red transition-colors duration-200">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-base text-gray-500 leading-relaxed line-clamp-2">{article.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── MORE STORIES ─── */}
      {moreStories.length > 0 && (
        <section className="bg-white">
          <div className="container mx-auto px-6 max-w-screen-xl pt-16 pb-20">
            <SectionHeader title="More Stories" color="#FF1001" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {moreStories.map(article => <ArticleCard key={article.id} article={article} variant="standard" />)}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

// ─── Hero Carousel ─── //
function HeroCarousel({ articles }: { articles: any[] }) {
  const [current, setCurrent] = useState(0);
  const total = articles.length;

  const goNext = useCallback(() => setCurrent(i => (i + 1) % total), [total]);
  const goPrev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total]);

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [total, goNext]);

  const article = articles[current];

  return (
    <section className="bg-white relative">
      <div className="container mx-auto px-6 max-w-screen-xl py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 font-display text-sm font-medium text-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                {article.category?.name}
              </span>
              <span className="text-sm text-gray-400">
                {article.published_at && new Date(article.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <Link to={`/article/${article.slug}`} className="group">
              <h1 className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08] mb-6 text-brand-black group-hover:text-brand-red transition-colors duration-200">
                {article.title}
              </h1>
            </Link>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">{article.author_name}</span>
              {total > 1 && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    {articles.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1 transition-all duration-300 ${i === current ? 'w-6 bg-brand-red' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={goPrev} className="p-2 border border-gray-200 text-gray-400 hover:border-brand-black hover:text-brand-black transition-colors">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={goNext} className="p-2 border border-gray-200 text-gray-400 hover:border-brand-black hover:text-brand-black transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Link to={`/article/${article.slug}`}>
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                {article.cover_image && <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section Header ─── //
function SectionHeader({ title, color, href }: { title: string; color?: string; href?: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      {color && <span className="w-1 h-8 flex-shrink-0" style={{ backgroundColor: color }} />}
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      {href && (
        <Link to={href} className="ml-auto flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-brand-black transition-colors">
          View All
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3.5l4.5 4.5-4.5 4.5"/></svg>
        </Link>
      )}
    </div>
  );
}

export default Home;
