import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import { AboutPage } from './pages/StaticPages';
import { supabase } from './src/lib/supabase';
import { PreloadedDataContext, Article } from './src/hooks/useArticles';

// Admin imports
import { Login } from './src/admin/pages/Login';
import { Dashboard } from './src/admin/pages/Dashboard';
import { ArticleList } from './src/admin/pages/ArticleList';
import { MediaLibrary } from './src/admin/pages/MediaLibrary';
import { ArticleEditor } from './src/admin/pages/ArticleEditor';
import { AdminLayout } from './src/admin/components/AdminLayout';
import { ProtectedRoute } from './src/admin/components/ProtectedRoute';

const ARTICLE_SELECT = `
  id, title, slug, subtitle, excerpt, content, cover_image, status, featured, author_name, published_at, created_at,
  category:categories(id, name, slug, color, description)
`;

// ScrollToTop component to handle scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedData, setPreloadedData] = useState<{
    articles: Article[];
    trending: Article[];
    isReady: boolean;
  }>({
    articles: [],
    trending: [],
    isReady: false,
  });

  // Preload data on mount
  useEffect(() => {
    async function preloadData() {
      try {
        // Fetch articles and trending in parallel
        const [articlesResult, trendingResult] = await Promise.all([
          supabase
            .from('articles')
            .select(ARTICLE_SELECT)
            .eq('status', 'published')
            .order('published_at', { ascending: false }),
          supabase.rpc('get_trending_articles', { max_results: 5 }),
        ]);

        const articles = (articlesResult.data || []) as Article[];
        let trending: Article[] = [];

        if (trendingResult.data?.length) {
          const ids = trendingResult.data.map((r: any) => r.id);
          const { data: trendingArticles } = await supabase
            .from('articles')
            .select(ARTICLE_SELECT)
            .in('id', ids);

          if (trendingArticles) {
            const byId = new Map(trendingArticles.map((a: any) => [a.id, a]));
            trending = ids.map((id: string) => byId.get(id)).filter(Boolean) as Article[];
          }
        }

        // Preload cover images for faster rendering
        const imagesToPreload = [...articles, ...trending]
          .map(a => a.cover_image)
          .filter((img): img is string => !!img)
          .slice(0, 8);

        await Promise.all(
          imagesToPreload.map(src => {
            return new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = src;
            });
          })
        );

        setPreloadedData({
          articles,
          trending,
          isReady: true,
        });
      } catch (error) {
        console.error('Preload error:', error);
        setPreloadedData(prev => ({ ...prev, isReady: true }));
      }
    }

    preloadData();
  }, []);

  if (isLoading) {
    return (
      <LoadingScreen
        onLoadingComplete={() => setIsLoading(false)}
        minDisplayTime={1500}
        isDataReady={preloadedData.isReady}
      />
    );
  }

  return (
    <PreloadedDataContext.Provider value={preloadedData}>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<ArticleList />} />
            <Route path="articles/new" element={<ArticleEditor />} />
            <Route path="articles/:id" element={<ArticleEditor />} />
            <Route path="media" element={<MediaLibrary />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/category/:categoryName" element={<Layout><CategoryPage /></Layout>} />
          <Route path="/article/:slug" element={<Layout><ArticlePage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        </Routes>
      </Router>
    </PreloadedDataContext.Provider>
  );
};

export default App;
