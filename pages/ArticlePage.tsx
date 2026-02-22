import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Share2, Link2, X } from 'lucide-react';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { useArticle, useArticles } from '../src/hooks/useArticles';
import { supabase } from '../src/lib/supabase';
import ArticleCard from '../components/ArticleCard';

function renderContent(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  try {
    return generateHTML(content, [StarterKit]);
  } catch {
    return '';
  }
}

function ShareMenu({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const url = window.location.href;
  const text = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => { setCopied(false); setOpen(false); }, 1500);
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-brand-black transition-colors cursor-pointer">
        <Share2 size={20} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 shadow-lg py-2 w-48 z-50">
          <a href={`https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            <X size={16} /> Post on X
          </a>
          <a href={`https://wa.me/?text=${text}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <button onClick={copyLink} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer w-full text-left">
            <Link2 size={16} /> {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
}

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { article, loading } = useArticle(slug || '');
  const { articles: allArticles } = useArticles();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Increment view count
  const articleId = article?.id
  useEffect(() => {
    if (!articleId) return
    supabase.rpc('increment_view_count', { article_id: articleId }).then(({ error }) => {
      if (error) console.error('View count error:', error)
    })
  }, [articleId]);

  if (loading) {
    return (
      <div className="animate-pulse bg-white min-h-screen">
        <div className="container mx-auto px-6 max-w-screen-lg pt-16 pb-10">
          <div className="h-3 w-20 bg-gray-200 rounded mb-6" />
          <div className="h-12 w-full bg-gray-200 rounded mb-3" />
          <div className="h-12 w-2/3 bg-gray-200 rounded mb-6" />
          <div className="h-5 w-1/2 bg-gray-100 rounded mb-8" />
          <div className="flex gap-6 py-3">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 max-w-screen-lg mb-10 md:mb-16">
          <div className="aspect-[16/9] bg-gray-200 rounded" />
        </div>
        <div className="container mx-auto px-6 max-w-screen-lg">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-5 bg-gray-100 rounded mb-4" style={{ width: `${85 - i * 8}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-20 text-center">
        <h1 className="font-serif text-2xl mb-4">Article not found</h1>
        <Link to="/" className="text-brand-red hover:underline">Go back home</Link>
      </div>
    );
  }

  const categorySlug = article.category?.slug || '';
  const categoryName = article.category?.name || '';
  const authorName = article.author_name || '';
  const publishDate = article.published_at || article.created_at;

  return (
    <article className="bg-white min-h-screen pb-24">

      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 max-w-screen-lg pt-8 md:pt-16 pb-6 md:pb-10">
        <Link to={`/category/${categorySlug}`} className="inline-block text-gray-medium font-semibold uppercase tracking-wider text-xs mb-6 hover:text-brand-black transition-colors">
          {categoryName}
        </Link>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight text-brand-black mb-4 md:mb-6 leading-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-lg md:text-xl text-gray-dark font-serif leading-relaxed mb-5 md:mb-8 max-w-2xl">
            {article.subtitle}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-medium">
            <span className="font-display font-medium text-brand-black">{authorName || 'Staff Writer'}</span>
            <span>{publishDate && new Date(publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <ShareMenu title={article.title} />
        </div>
      </header>

      {/* Hero Image */}
      {article.cover_image && (
        <div className="container mx-auto px-4 sm:px-6 max-w-screen-lg mb-10 md:mb-16">
          <div className="aspect-[16/9] w-full bg-gray-light overflow-hidden">
            <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 max-w-screen-lg">
        <div className="article-content max-w-screen-md" dangerouslySetInnerHTML={{ __html: renderContent(article.content) }} />
      </div>

      {/* More Stories */}
      {(() => {
        const moreStories = allArticles.filter(a => a.id !== article.id).slice(0, 4);
        if (!moreStories.length) return null;
        return (
          <section className="mt-12 md:mt-20">
            <div className="container mx-auto px-4 sm:px-6 max-w-screen-xl pt-10 pb-12 md:pt-16 md:pb-20">
              <div className="flex items-center gap-4 mb-10">
                <span className="w-1 h-8 flex-shrink-0 bg-brand-red" />
                <h2 className="font-display text-2xl font-bold tracking-tight">More Stories</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
                {moreStories.map(a => (
                  <ArticleCard key={a.id} article={a} variant="standard" />
                ))}
              </div>
            </div>
          </section>
        );
      })()}

    </article>
  );
};

export default ArticlePage;
