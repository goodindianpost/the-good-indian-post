-- =============================================
-- The Good Indian Post - Complete Database Setup
-- Combined Migration File
-- Run this entire file in Supabase SQL Editor
-- =============================================

-- =============================================
-- PART 1: CREATE TYPES AND TABLES
-- =============================================

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'author');
CREATE TYPE article_status AS ENUM ('draft', 'review', 'published', 'archived');

-- PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role user_role DEFAULT 'author',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORIES TABLE
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ARTICLES TABLE
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  excerpt TEXT,
  content JSONB,
  cover_image TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status article_status DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TAGS TABLE
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- ARTICLE_TAGS JUNCTION TABLE
CREATE TABLE article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- MEDIA TABLE
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  alt_text TEXT,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for performance
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_featured ON articles(featured) WHERE featured = TRUE;
CREATE INDEX idx_articles_trending ON articles(trending) WHERE trending = TRUE;
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_tags_slug ON tags(slug);

-- =============================================
-- PART 2: FUNCTIONS AND TRIGGERS
-- =============================================

-- Function: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function: Auto-set published_at when status changes to published
CREATE OR REPLACE FUNCTION handle_article_publish()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_article_publish
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION handle_article_publish();

-- Function: Generate slug from title
CREATE OR REPLACE FUNCTION slugify(text)
RETURNS text AS $$
  SELECT lower(
    regexp_replace(
      regexp_replace(
        regexp_replace($1, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
$$ LANGUAGE sql IMMUTABLE;

-- Function: Get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- =============================================
-- PART 3: ROW LEVEL SECURITY POLICIES
-- =============================================

-- PROFILES RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- CATEGORIES RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

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

-- ARTICLES RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published articles"
  ON articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authenticated users can read all articles"
  ON articles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authors can create articles"
  ON articles FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Authors can update own articles"
  ON articles FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete own drafts"
  ON articles FOR DELETE
  USING (auth.uid() = author_id AND status = 'draft');

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

-- TAGS RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

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

-- ARTICLE_TAGS RLS
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article tags are viewable by everyone"
  ON article_tags FOR SELECT
  USING (true);

CREATE POLICY "Authors can manage own article tags"
  ON article_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE id = article_id AND author_id = auth.uid()
    )
  );

CREATE POLICY "Editors can manage all article tags"
  ON article_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('editor', 'admin')
    )
  );

-- MEDIA RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media is viewable by everyone"
  ON media FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload media"
  ON media FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update own media"
  ON media FOR UPDATE
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete own media"
  ON media FOR DELETE
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all media"
  ON media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =============================================
-- PART 4: SEED DATA
-- =============================================

-- Insert the 6 default categories
INSERT INTO categories (name, slug, color, description, sort_order) VALUES
  ('News', 'news', '#facc15', 'Breaking news and current events from India and around the world', 1),
  ('Good Indians', 'good-indians', '#22d3ee', 'Inspiring stories of Indians making a positive impact', 2),
  ('Global Indians', 'global-indians', '#10b981', 'Stories of the Indian diaspora across the globe', 3),
  ('Culture', 'culture', '#6366f1', 'Art, music, traditions, and the evolving Indian cultural landscape', 4),
  ('Literature', 'literature', '#a855f7', 'Book reviews, author interviews, and literary discourse', 5),
  ('Film', 'film', '#ec4899', 'Cinema reviews, industry news, and behind-the-scenes stories', 6);

-- =============================================
-- SETUP COMPLETE!
-- Next steps:
-- 1. Create a 'media' storage bucket (Storage → New bucket)
-- 2. Run 005_storage_setup.sql for storage policies
-- 3. Create your admin user (Authentication → Users)
-- 4. Update their role to 'admin' in the profiles table
-- =============================================
