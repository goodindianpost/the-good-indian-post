-- =============================================
-- The Good Indian Post - Database Functions & Triggers
-- Migration 002: Functions and Triggers
-- =============================================

-- =============================================
-- Function: Auto-create profile on user signup
-- =============================================
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

-- Trigger: Create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- Function: Auto-update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update articles.updated_at on update
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- Function: Auto-set published_at when status changes to published
-- =============================================
CREATE OR REPLACE FUNCTION handle_article_publish()
RETURNS TRIGGER AS $$
BEGIN
  -- Set published_at when article is first published
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Handle article publish
CREATE TRIGGER on_article_publish
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION handle_article_publish();

-- =============================================
-- Function: Generate slug from title
-- =============================================
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

-- =============================================
-- Function: Get user role
-- =============================================
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;
