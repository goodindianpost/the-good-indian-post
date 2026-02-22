import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import { AboutPage, ContactPage } from './pages/StaticPages';

// Admin imports
import { Login } from './src/admin/pages/Login';
import { Dashboard } from './src/admin/pages/Dashboard';
import { ArticleList } from './src/admin/pages/ArticleList';
import { MediaLibrary } from './src/admin/pages/MediaLibrary';
import { ArticleEditor } from './src/admin/pages/ArticleEditor';
import { AdminLayout } from './src/admin/components/AdminLayout';
import { ProtectedRoute } from './src/admin/components/ProtectedRoute';

// ScrollToTop component to handle scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
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
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;