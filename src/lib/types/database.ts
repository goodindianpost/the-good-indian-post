export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'editor' | 'author'
export type ArticleStatus = 'draft' | 'review' | 'published' | 'archived'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          bio: string | null
          role: UserRole
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          bio?: string | null
          role?: UserRole
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          role?: UserRole
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          color: string
          description: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          color: string
          description?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          color?: string
          description?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          subtitle: string | null
          excerpt: string | null
          content: Json | null
          cover_image: string | null
          category_id: string | null
          author_id: string | null
          status: ArticleStatus
          featured: boolean
          trending: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          subtitle?: string | null
          excerpt?: string | null
          content?: Json | null
          cover_image?: string | null
          category_id?: string | null
          author_id?: string | null
          status?: ArticleStatus
          featured?: boolean
          trending?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          subtitle?: string | null
          excerpt?: string | null
          content?: Json | null
          cover_image?: string | null
          category_id?: string | null
          author_id?: string | null
          status?: ArticleStatus
          featured?: boolean
          trending?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
      }
      media: {
        Row: {
          id: string
          url: string
          filename: string
          alt_text: string | null
          file_size: number | null
          mime_type: string | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          url: string
          filename: string
          alt_text?: string | null
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          url?: string
          filename?: string
          alt_text?: string | null
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      article_status: ArticleStatus
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Article = Database['public']['Tables']['articles']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type Media = Database['public']['Tables']['media']['Row']

// Extended types with relations
export type ArticleWithRelations = Article & {
  category: Category | null
  author: Profile | null
  tags: Tag[]
}
