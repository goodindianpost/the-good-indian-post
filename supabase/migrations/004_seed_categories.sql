-- =============================================
-- The Good Indian Post - Seed Data
-- Migration 004: Seed Categories
-- =============================================

-- Insert the 6 default categories
INSERT INTO categories (name, slug, color, description, sort_order) VALUES
  ('News', 'news', '#FF1001', 'Breaking news and current events from India and around the world', 1),
  ('Good Indians', 'good-indians', '#FF1001', 'Inspiring stories of Indians making a positive impact', 2),
  ('Global Indians', 'global-indians', '#FF1001', 'Stories of the Indian diaspora across the globe', 3),
  ('Culture', 'culture', '#FF1001', 'Art, music, traditions, and the evolving Indian cultural landscape', 4),
  ('Literature', 'literature', '#FF1001', 'Book reviews, author interviews, and literary discourse', 5),
  ('Film', 'film', '#FF1001', 'Cinema reviews, industry news, and behind-the-scenes stories', 6);
