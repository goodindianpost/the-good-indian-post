export enum Category {
  NEWS = 'News',
  GOOD_INDIANS = 'Good Indians',
  GLOBAL_INDIANS = 'Global Indians',
  CULTURE = 'Culture',
  LITERATURE = 'Literature',
  FILM = 'Film'
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: Category;
  author: string;
  publishDate: string; // ISO String
  excerpt: string;
  content: string; // HTML string for prototype
  imageUrl: string;
  featured?: boolean;
  trending?: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  category?: Category;
}