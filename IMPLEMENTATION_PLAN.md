# Implementation Plan: The Good Indian Post - Admin Portal & CMS

## Pre-Implementation Decisions

Before we begin, we need to clarify a few architectural decisions:

| Question | Recommended Approach |
|----------|---------------------|
| Admin portal location | Same repo, `/admin` route (simpler deployment, shared components) |
| Rich text editor | TipTap (better React integration, extensible, good docs) |
| Image optimization | Supabase image transformations (built-in, no extra service) |
| Hosting | Vercel (excellent Vite support, easy preview deployments) |

---

## Phase 1: Foundation (Supabase Setup)

### Step 1.1: Create Supabase Project
- [ ] Create new Supabase project at supabase.com
- [ ] Note down project URL and anon/service keys
- [ ] Install Supabase client: `npm install @supabase/supabase-js`
- [ ] Create `/src/lib/supabase.ts` client configuration

### Step 1.2: Database Schema - Create Tables

#### 1.2.1: Create `profiles` table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role TEXT CHECK (role IN ('admin', 'editor', 'author')) DEFAULT 'author',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 1.2.2: Create `categories` table
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 1.2.3: Create `articles` table
```sql
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
  status TEXT CHECK (status IN ('draft', 'review', 'published', 'archived')) DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 1.2.4: Create `tags` and `article_tags` tables
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);
```

#### 1.2.5: Create `media` table
```sql
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
```

### Step 1.3: Database Functions & Triggers

#### 1.3.1: Auto-create profile on signup
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

#### 1.3.2: Auto-update `updated_at` timestamp
```sql
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
```

### Step 1.4: Row Level Security (RLS) Policies

#### 1.4.1: Profiles RLS
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "Public profiles are viewable"
  ON profiles FOR SELECT USING (true);

-- Users can update own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

#### 1.4.2: Articles RLS
```sql
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  USING (status = 'published');

-- Authenticated users can read all (for admin)
CREATE POLICY "Authenticated can read all articles"
  ON articles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authors can insert own articles
CREATE POLICY "Authors can create articles"
  ON articles FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update own articles
CREATE POLICY "Authors can update own articles"
  ON articles FOR UPDATE
  USING (auth.uid() = author_id);

-- Editors/Admins can manage all articles
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

#### 1.4.3: Categories RLS
```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read categories
CREATE POLICY "Categories are viewable by all"
  ON categories FOR SELECT USING (true);

-- Only editors/admins can manage categories
CREATE POLICY "Editors can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('editor', 'admin')
    )
  );
```

### Step 1.5: Storage Bucket Setup
- [ ] Create `media` bucket in Supabase Storage
- [ ] Set bucket to public (for image serving)
- [ ] Configure upload policies (authenticated users only)

### Step 1.6: Seed Initial Data
- [ ] Migrate 6 categories from current `data.ts`
- [ ] Create admin user account
- [ ] Migrate existing 16 mock articles to database

---

## Phase 2: Admin Portal - Core

### Step 2.1: Project Structure Setup

Create admin-specific folder structure:
```
src/
├── admin/
│   ├── components/
│   │   ├── AdminLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatsCard.tsx
│   │   └── DataTable.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ArticleList.tsx
│   │   ├── ArticleEditor.tsx
│   │   ├── CategoryList.tsx
│   │   ├── MediaLibrary.tsx
│   │   └── UserManagement.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useArticles.ts
│   │   ├── useCategories.ts
│   │   └── useMedia.ts
│   └── utils/
│       └── permissions.ts
├── lib/
│   ├── supabase.ts
│   └── types/
│       └── database.ts
```

### Step 2.2: Install Dependencies
```bash
npm install @supabase/supabase-js @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder react-dropzone date-fns
```

### Step 2.3: Supabase Client Setup
- [ ] Create `src/lib/supabase.ts` with client initialization
- [ ] Create TypeScript types from Supabase schema
- [ ] Set up environment variables (`.env.local`)

### Step 2.4: Authentication Flow
- [ ] Create `src/admin/pages/Login.tsx` - Email/password form
- [ ] Create `src/admin/hooks/useAuth.ts` - Auth state management
- [ ] Create `src/admin/components/ProtectedRoute.tsx` - Route guard
- [ ] Implement logout functionality
- [ ] Add password reset flow

### Step 2.5: Admin Layout
- [ ] Create `src/admin/components/AdminLayout.tsx` - Main wrapper
- [ ] Create `src/admin/components/Sidebar.tsx` - Navigation
  - Dashboard
  - Articles
  - Categories
  - Media
  - Users (admin only)
  - Settings (admin only)
- [ ] Create `src/admin/components/Header.tsx` - Top bar with user menu

### Step 2.6: Dashboard Page
- [ ] Create `src/admin/pages/Dashboard.tsx`
- [ ] Stats cards: Total articles, Published, Drafts, Categories
- [ ] Recent articles table (last 5)
- [ ] Quick action buttons (New Article, View Site)

### Step 2.7: Article List Page
- [ ] Create `src/admin/pages/ArticleList.tsx`
- [ ] Data table with columns: Title, Category, Author, Status, Date, Actions
- [ ] Filter by: Status, Category, Author
- [ ] Search by title
- [ ] Pagination
- [ ] Bulk actions (delete, change status)
- [ ] "New Article" button

### Step 2.8: Article Editor Page
- [ ] Create `src/admin/pages/ArticleEditor.tsx`
- [ ] Title input (auto-generates slug)
- [ ] Subtitle input (optional)
- [ ] TipTap rich text editor with toolbar:
  - Headings (H2, H3, H4)
  - Bold, Italic, Underline
  - Bullet & Numbered lists
  - Blockquotes
  - Links
  - Images (upload inline)
- [ ] Excerpt textarea (with character count)
- [ ] Cover image uploader (drag & drop)
- [ ] Category dropdown
- [ ] Tags input (multi-select/create)
- [ ] Featured toggle
- [ ] Status selector (Draft, Review, Published)
- [ ] Schedule publish date picker
- [ ] Save Draft / Publish buttons
- [ ] Preview button (opens in new tab)
- [ ] Delete button (with confirmation modal)

### Step 2.9: Image Upload Functionality
- [ ] Create `src/admin/hooks/useMediaUpload.ts`
- [ ] Drag & drop zone component
- [ ] Upload progress indicator
- [ ] Image preview after upload
- [ ] Store in Supabase Storage, save URL to media table

---

## Phase 3: Admin Portal - Complete

### Step 3.1: Category Management
- [ ] Create `src/admin/pages/CategoryList.tsx`
- [ ] List all categories with color preview
- [ ] Create/Edit modal:
  - Name input
  - Slug input (auto-generated)
  - Color picker
  - Description textarea
- [ ] Delete category (block if articles exist, show count)
- [ ] Drag-to-reorder functionality

### Step 3.2: Media Library
- [ ] Create `src/admin/pages/MediaLibrary.tsx`
- [ ] Grid view of all images
- [ ] Upload zone (multiple files)
- [ ] Image details panel (filename, size, uploaded by, date)
- [ ] Edit alt text
- [ ] Copy URL button
- [ ] Delete image (confirm if used in articles)
- [ ] Search by filename

### Step 3.3: User Management (Admin Only)
- [ ] Create `src/admin/pages/UserManagement.tsx`
- [ ] List all users with role badges
- [ ] Invite new user form (email + role)
- [ ] Edit user role dropdown
- [ ] Deactivate/Reactivate user toggle
- [ ] View user's articles link

### Step 3.4: Settings Page (Admin Only)
- [ ] Create `src/admin/pages/Settings.tsx`
- [ ] Site name input
- [ ] Site description textarea
- [ ] Social media links (Twitter, Instagram, LinkedIn, YouTube)
- [ ] Default cover image uploader

### Step 3.5: Search & Filters Enhancement
- [ ] Global search in header (searches articles, categories, users)
- [ ] Advanced filters on article list
- [ ] Date range picker
- [ ] Sort options (newest, oldest, alphabetical)

### Step 3.6: Draft/Publish Workflow
- [ ] Status transitions:
  - Author: draft → review
  - Editor: review → published, published → archived
  - Admin: any status change
- [ ] Email notification on status change (optional, Phase 2)
- [ ] "Review Queue" view for editors

---

## Phase 4: Public Site Integration

### Step 4.1: Create Data Hooks
- [ ] Create `src/hooks/useArticles.ts`
  - `useArticles(filters)` - List with filtering
  - `useArticle(slug)` - Single article
  - `useFeaturedArticles()` - Homepage featured
  - `useTrendingArticles()` - Trending sidebar
  - `useArticlesByCategory(category)` - Category page
- [ ] Create `src/hooks/useCategories.ts`
  - `useCategories()` - All categories
  - `useCategory(slug)` - Single category
- [ ] Create `src/hooks/useAuthors.ts`
  - `useAuthor(id)` - Author profile

### Step 4.2: Update Pages to Use Supabase

#### 4.2.1: Update `Home.tsx`
- [ ] Replace static imports with `useFeaturedArticles()`
- [ ] Add loading skeleton states
- [ ] Add error handling UI

#### 4.2.2: Update `CategoryPage.tsx`
- [ ] Replace static data with `useArticlesByCategory()`
- [ ] Implement real pagination
- [ ] Loading states

#### 4.2.3: Update `ArticlePage.tsx`
- [ ] Replace static lookup with `useArticle(slug)`
- [ ] Fetch related articles dynamically
- [ ] 404 handling for missing articles
- [ ] Loading state

### Step 4.3: New Public Pages

#### 4.3.1: Author Profile Page
- [ ] Create `src/pages/AuthorPage.tsx`
- [ ] Author bio, avatar, social links
- [ ] List of author's published articles
- [ ] Add route `/author/:slug`

#### 4.3.2: Search Page
- [ ] Create `src/pages/SearchPage.tsx`
- [ ] Search input with debounce
- [ ] Results list with highlighting
- [ ] Filter by category
- [ ] Add route `/search`

#### 4.3.3: Tag Page
- [ ] Create `src/pages/TagPage.tsx`
- [ ] List articles with specific tag
- [ ] Add route `/tag/:slug`

### Step 4.4: Update Components
- [ ] Update `ArticleCard.tsx` to work with new data structure
- [ ] Update `Header.tsx` - Add search functionality
- [ ] Create `LoadingSkeleton.tsx` components
- [ ] Create `ErrorBoundary.tsx` component

### Step 4.5: Data Migration Script
- [ ] Create script to migrate `data.ts` → Supabase
- [ ] Map old categories to new category IDs
- [ ] Convert HTML content to TipTap JSON format
- [ ] Upload images to Supabase Storage

---

## Phase 5: Polish & Launch

### Step 5.1: Error Handling
- [ ] Global error boundary
- [ ] API error handling with user-friendly messages
- [ ] Form validation errors
- [ ] Network offline detection

### Step 5.2: Loading States
- [ ] Skeleton loaders for articles
- [ ] Spinner for form submissions
- [ ] Progress bars for uploads
- [ ] Optimistic updates where appropriate

### Step 5.3: Performance Optimization
- [ ] Image lazy loading
- [ ] Infinite scroll for article lists
- [ ] React Query or SWR for caching
- [ ] Bundle size analysis

### Step 5.4: SEO & Meta Tags
- [ ] Dynamic meta tags per page
- [ ] Open Graph tags for social sharing
- [ ] Twitter card meta
- [ ] Structured data (JSON-LD)
- [ ] Sitemap generation

### Step 5.5: Additional Pages
- [ ] Create `src/pages/NotFound.tsx` - 404 page
- [ ] Update existing static pages with real data

### Step 5.6: Testing
- [ ] Manual testing checklist
- [ ] Test all CRUD operations
- [ ] Test role-based permissions
- [ ] Test responsive design
- [ ] Cross-browser testing

### Step 5.7: Deployment
- [ ] Set up Vercel project
- [ ] Configure environment variables
- [ ] Set up preview deployments
- [ ] Configure custom domain
- [ ] SSL certificate

### Step 5.8: Documentation
- [ ] Admin user guide
- [ ] API documentation
- [ ] Deployment guide
- [ ] Environment variables reference

---

## File Structure After Implementation

```
src/
├── admin/
│   ├── components/
│   │   ├── AdminLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── StatsCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── ArticleForm.tsx
│   │   ├── CategoryForm.tsx
│   │   ├── MediaUploader.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── UserRoleBadge.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ArticleList.tsx
│   │   ├── ArticleEditor.tsx
│   │   ├── CategoryList.tsx
│   │   ├── MediaLibrary.tsx
│   │   ├── UserManagement.tsx
│   │   └── Settings.tsx
│   └── hooks/
│       ├── useAuth.ts
│       ├── useArticles.ts
│       ├── useCategories.ts
│       ├── useMedia.ts
│       └── useUsers.ts
├── components/
│   ├── ArticleCard.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── Newsletter.tsx
│   ├── LoadingSkeleton.tsx
│   └── ErrorBoundary.tsx
├── pages/
│   ├── Home.tsx
│   ├── ArticlePage.tsx
│   ├── CategoryPage.tsx
│   ├── AuthorPage.tsx
│   ├── SearchPage.tsx
│   ├── TagPage.tsx
│   ├── StaticPages.tsx
│   └── NotFound.tsx
├── hooks/
│   ├── useArticles.ts
│   ├── useCategories.ts
│   └── useAuthors.ts
├── lib/
│   ├── supabase.ts
│   └── types/
│       └── database.ts
├── utils/
│   ├── colors.ts
│   ├── slugify.ts
│   └── formatDate.ts
├── App.tsx
├── index.tsx
├── index.css
└── types.ts
```

---

## Estimated Task Breakdown

| Phase | Tasks | Priority |
|-------|-------|----------|
| Phase 1 | 6 major steps | P0 - Must do first |
| Phase 2 | 9 major steps | P0 - Core functionality |
| Phase 3 | 6 major steps | P1 - Complete admin |
| Phase 4 | 5 major steps | P1 - Public integration |
| Phase 5 | 8 major steps | P2 - Polish |

---

## Next Steps

1. **Confirm architectural decisions** (admin location, editor choice)
2. **Set up Supabase project** and obtain credentials
3. **Begin Phase 1** - Database schema creation

Ready to proceed?
