import mongoose, { Schema, model, models } from 'mongoose';

export interface IComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: number;
}

export interface IPost {
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: number;
  likes: number;
  views: number;
  comments: IComment[];
}

const CommentSchema = new Schema<IComment>({
  id: { type: String, required: true },
  author: { type: String, required: true },
  avatar: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Number, required: true },
});

const PostSchema = new Schema<IPost>({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  author: { type: String, required: true, default: 'Admin' },
  createdAt: { type: Number, default: Date.now },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  comments: { type: [CommentSchema], default: [] },
});

export const Post = models.Post || model<IPost>('Post', PostSchema);
