-- =============================================
-- The Good Indian Post - Update Category Descriptions
-- Migration 006: Update Category Descriptions
-- =============================================

UPDATE categories SET description = 'There is always good news for those who want to read them. This is what is good in India lately.' WHERE slug = 'news';
UPDATE categories SET description = 'Stories of ordinary Indians across the country with extraordinary dreams.' WHERE slug = 'good-indians';
UPDATE categories SET description = 'Know of Indians putting the country on the global map. (And for good!)' WHERE slug = 'global-indians';
UPDATE categories SET description = 'From Kashmir to Kanyakumari, the culture that makes us Indians.' WHERE slug = 'culture';
UPDATE categories SET description = 'Find your next read by an Indian author here.' WHERE slug = 'literature';
UPDATE categories SET description = 'The films you watch, the stories you don''t.' WHERE slug = 'film';
