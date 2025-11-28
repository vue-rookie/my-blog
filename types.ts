export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: number;
  avatar: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown content
  category: string;
  tags: string[];
  coverImage?: string;
  author: string;
  createdAt: number;
  likes: number;
  views: number;
  comments: Comment[];
}

export type Category = '技术' | '生活' | '设计' | '随笔';

export const CATEGORIES: Category[] = ['技术', '生活', '设计', '随笔'];

export interface AIResponse {
  summary?: string;
  suggestedTitle?: string;
  tags?: string[];
}

export interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}