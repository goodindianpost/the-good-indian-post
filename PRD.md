# Product Requirements Document (PRD)
## The Good Indian Post - Admin Portal & CMS

**Version:** 1.0
**Date:** February 2026
**Status:** Draft

---

## 1. Overview

### 1.1 Product Summary
Build a custom admin portal for The Good Indian Post that allows editors and authors to manage articles, categories, authors, and media assets. The public-facing React website will fetch content from Supabase instead of static data.

### 1.2 Goals
- Replace static `data.ts` with a dynamic database-driven content system
- Provide an intuitive admin interface for content management
- Support multiple user roles (Admin, Editor, Author)
- Enable draft/publish workflow for articles
- Manage media assets (images) efficiently

### 1.3 Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend (Public) | React 19 + Vite + Tailwind CSS v4 |
| Frontend (Admin) | React + Tailwind (same repo or separate) |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Hosting | TBD (Vercel, Netlify, etc.) |

---

## 2. User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: manage users, all articles, categories, site settings |
| **Editor** | Manage all articles (create, edit, publish, delete), manage categories |
| **Author** | Create and edit own articles only, submit for review |

---

## 3. Database Schema

### 3.1 Tables

#### `profiles` (extends Supabase auth.users)
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK, FK → auth.users) | User ID |
| full_name | TEXT | Display name |
| avatar_url | TEXT | Profile image URL |
| bio | TEXT | Author bio |
| role | ENUM ('admin', 'editor', 'author') | User role |
| created_at | TIMESTAMP | Account creation date |

#### `categories`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Category ID |
| name | TEXT | Category name (e.g., "Culture") |
| slug | TEXT (UNIQUE) | URL-friendly name |
| color | TEXT | Hex color code |
| description | TEXT | Category description |
| created_at | TIMESTAMP | Creation date |

#### `articles`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Article ID |
| title | TEXT | Article title |
| slug | TEXT (UNIQUE) | URL-friendly title |
| excerpt | TEXT | Short summary |
| content | JSONB | Rich text content (TipTap JSON) |
| cover_image | TEXT | Cover image URL |
| category_id | UUID (FK → categories) | Category reference |
| author_id | UUID (FK → profiles) | Author reference |
| status | ENUM ('draft', 'review', 'published', 'archived') | Publication status |
| featured | BOOLEAN | Featured on homepage |
| published_at | TIMESTAMP | Publication date |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last modified date |

#### `tags`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Tag ID |
| name | TEXT | Tag name |
| slug | TEXT (UNIQUE) | URL-friendly name |

#### `article_tags` (junction table)
| Column | Type | Description |
|--------|------|-------------|
| article_id | UUID (FK → articles) | Article reference |
| tag_id | UUID (FK → tags) | Tag reference |

#### `media`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Media ID |
| url | TEXT | Supabase storage URL |
| filename | TEXT | Original filename |
| alt_text | TEXT | Accessibility text |
| uploaded_by | UUID (FK → profiles) | Uploader reference |
| created_at | TIMESTAMP | Upload date |

---

## 4. Features

### 4.1 Admin Dashboard

#### Authentication
- [ ] Login page with email/password
- [ ] Password reset flow
- [ ] Session management
- [ ] Protected routes based on role

#### Dashboard Home
- [ ] Overview stats (total articles, drafts, published)
- [ ] Recent activity feed
- [ ] Quick actions (new article, view site)

#### Article Management
- [ ] List all articles with filters (status, category, author, date)
- [ ] Search articles by title/content
- [ ] Create new article
- [ ] Rich text editor (TipTap or Lexical)
- [ ] Image upload within editor
- [ ] Set cover image
- [ ] Select category
- [ ] Add tags
- [ ] Save as draft
- [ ] Submit for review (Author role)
- [ ] Publish/Unpublish (Editor/Admin)
- [ ] Schedule publication date
- [ ] Mark as featured
- [ ] Delete article (with confirmation)
- [ ] Duplicate article

#### Category Management
- [ ] List all categories
- [ ] Create/Edit category (name, slug, color, description)
- [ ] Delete category (prevent if articles exist)
- [ ] Reorder categories

#### Author/User Management (Admin only)
- [ ] List all users
- [ ] Invite new user (sends email)
- [ ] Edit user role
- [ ] Deactivate user
- [ ] View author's articles

#### Media Library
- [ ] Grid view of all uploaded images
- [ ] Upload new images (drag & drop)
- [ ] Delete images
- [ ] Copy image URL
- [ ] Search/filter media

#### Settings (Admin only)
- [ ] Site name/description
- [ ] Social media links
- [ ] Default featured image

### 4.2 Public Website Updates

#### Data Fetching
- [ ] Replace `data.ts` imports with Supabase queries
- [ ] Fetch articles by category
- [ ] Fetch single article by slug
- [ ] Fetch featured articles
- [ ] Fetch author profiles

#### New Features
- [ ] Author profile pages (`/author/:slug`)
- [ ] Search functionality (`/search?q=`)
- [ ] Tags pages (`/tag/:slug`)
- [ ] Related articles on article page

---

## 5. API / Data Access

Using Supabase client directly with Row Level Security (RLS):

### Public (Anonymous) Access
- Read published articles
- Read categories
- Read author profiles (public info only)

### Authenticated Access
- Authors: CRUD own articles
- Editors: CRUD all articles, manage categories
- Admins: Full access + user management

### Example RLS Policies
```sql
-- Anyone can read published articles
CREATE POLICY "Public can read published articles"
ON articles FOR SELECT
USING (status = 'published');

-- Authors can manage their own articles
CREATE POLICY "Authors can manage own articles"
ON articles FOR ALL
USING (auth.uid() = author_id);

-- Editors can manage all articles
CREATE POLICY "Editors can manage all articles"
ON articles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('editor', 'admin')
  )
);
```

---

## 6. UI/UX Requirements

### Admin Portal Design
- Clean, minimal interface (similar to Notion or Linear)
- Sidebar navigation
- Responsive (works on tablet, but desktop-first)
- Dark mode support (optional, phase 2)
- Match brand colors (brand-black, brand-red)

### Rich Text Editor Features
- Headings (H2, H3, H4)
- Bold, italic, underline
- Bullet and numbered lists
- Blockquotes
- Links
- Images (inline upload)
- Embeds (YouTube, Twitter) - phase 2
- Code blocks - phase 2

---

## 7. Security Considerations

- All admin routes protected by authentication
- Role-based access control via RLS
- Supabase Storage bucket policies (authenticated uploads only)
- Input sanitization for rich text content
- HTTPS only
- Rate limiting on auth endpoints (Supabase built-in)

---

## 8. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up Supabase project
- [ ] Create database schema (tables, relationships)
- [ ] Configure authentication
- [ ] Set up storage bucket
- [ ] Implement RLS policies
- [ ] Migrate existing `data.ts` content to database

### Phase 2: Admin Portal - Core (Week 2)
- [ ] Admin app scaffolding (routing, layout)
- [ ] Login/logout flow
- [ ] Dashboard home page
- [ ] Article list page
- [ ] Article create/edit page with rich text editor
- [ ] Image upload functionality

### Phase 3: Admin Portal - Complete (Week 3)
- [ ] Category management
- [ ] Media library
- [ ] User management (Admin)
- [ ] Search and filters
- [ ] Draft/Publish workflow

### Phase 4: Public Site Integration (Week 4)
- [ ] Replace static data with Supabase queries
- [ ] Add loading states
- [ ] Add error handling
- [ ] Author pages
- [ ] Search page
- [ ] Related articles

### Phase 5: Polish & Launch (Week 5)
- [ ] Testing (manual + automated)
- [ ] Performance optimization
- [ ] SEO meta tags
- [ ] 404 page
- [ ] Deploy to production
- [ ] Documentation

---

## 9. Success Metrics

- Admin can create and publish an article in under 5 minutes
- Page load time < 2 seconds
- Zero downtime during content updates
- All CRUD operations work without errors

---

## 10. Open Questions

1. **Admin portal location:** Same repo (e.g., `/admin` route) or separate project?
2. **Editor choice:** TipTap vs Lexical vs other?
3. **Image optimization:** Use Supabase transformations or external service?
4. **Hosting:** Vercel, Netlify, or other?
5. **Domain:** Separate admin subdomain (admin.goodindianpost.com) or path (/admin)?

---

## 11. Out of Scope (Future)

- Comments system
- Newsletter integration (Mailchimp, ConvertKit)
- Analytics dashboard
- Multi-language support
- Revision history
- Collaborative editing
- Mobile app

---

## Appendix: Current Data Structure Reference

```typescript
// Current Article type from types.ts
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: Category;
  imageUrl: string;
  publishDate: string;
  featured?: boolean;
}

enum Category {
  CULTURE = 'Culture',
  FILM = 'Film',
  NEWS = 'News',
  GOOD_INDIANS = 'Good Indians',
  GLOBAL_INDIANS = 'Global Indians',
  LITERATURE = 'Literature',
}
```
