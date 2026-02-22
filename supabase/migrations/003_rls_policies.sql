-- =============================================
-- The Good Indian Post - Row Level Security Policies
-- Migration 003: RLS Policies
-- =============================================

-- =============================================
-- PROFILES RLS
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles (for author info on articles)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Only admins can change user roles
CREATE POLICY "Only admins can update roles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- CATEGORIES RLS
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Editors and admins can manage categories
CREATE POLICY "Editors can insert categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

CREATE POLICY "Editors can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

CREATE POLICY "Editors can delete categories"
  ON categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

-- =============================================
-- ARTICLES RLS
-- =============================================
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Anyone can read published articles"
  ON articles FOR SELECT
  USING (status = 'published');

-- Authenticated users can read all articles (for admin panel)
CREATE POLICY "Authenticated users can read all articles"
  ON articles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authors can create articles (assigned to themselves)
CREATE POLICY "Authors can create articles"
  ON articles FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid()
    )
  );

-- Authors can update their own articles
CREATE POLICY "Authors can update own articles"
  ON articles FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Authors can delete their own draft articles
CREATE POLICY "Authors can delete own drafts"
  ON articles FOR DELETE
  USING (auth.uid() = author_id AND status = 'draft');

-- Editors can manage all articles
CREATE POLICY "Editors can update all articles"
  ON articles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

CREATE POLICY "Editors can delete all articles"
  ON articles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

-- =============================================
-- TAGS RLS
-- =============================================
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Anyone can read tags
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

-- Authenticated users can create tags
CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Editors can manage tags
CREATE POLICY "Editors can update tags"
  ON tags FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

CREATE POLICY "Editors can delete tags"
  ON tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

-- =============================================
-- ARTICLE_TAGS RLS
-- =============================================
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- Anyone can read article tags
CREATE POLICY "Article tags are viewable by everyone"
  ON article_tags FOR SELECT
  USING (true);

-- Authors can manage tags on their own articles
CREATE POLICY "Authors can manage own article tags"
  ON article_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE id = article_id AND author_id = auth.uid()
    )
  );

-- Editors can manage all article tags
CREATE POLICY "Editors can manage all article tags"
  ON article_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

-- =============================================
-- MEDIA RLS
-- =============================================
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Anyone can view media (for public images)
CREATE POLICY "Media is viewable by everyone"
  ON media FOR SELECT
  USING (true);

-- Authenticated users can upload media
CREATE POLICY "Authenticated users can upload media"
  ON media FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

-- Users can update their own media
CREATE POLICY "Users can update own media"
  ON media FOR UPDATE
  USING (auth.uid() = uploaded_by);

-- Users can delete their own media
CREATE POLICY "Users can delete own media"
  ON media FOR DELETE
  USING (auth.uid() = uploaded_by);

-- Admins can manage all media
CREATE POLICY "Admins can manage all media"
  ON media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
