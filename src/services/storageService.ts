import { Post, Comment } from '../types';

// basePath 需要与 next.config.mjs 中的配置保持一致
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/blog';
const API_BASE = `${BASE_PATH}/api`;

// 获取所有文章
export const getPosts = async (category?: string, search?: string): Promise<Post[]> => {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const url = `${API_BASE}/posts${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) throw new Error(data.error);

    return data.data.map((post: any) => ({ ...post, id: post._id }));
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
};

// 根据 ID 获取文章
export const getPostById = async (id: string): Promise<Post | undefined> => {
  try {
    const response = await fetch(`${API_BASE}/posts/${id}`);
    const data = await response.json();

    if (!data.success) throw new Error(data.error);

    return { ...data.data, id: data.data._id };
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return undefined;
  }
};

// 保存或更新文章
export const savePost = async (post: Post): Promise<void> => {
  try {
    const isUpdate = !!post.id;
    const url = isUpdate ? `${API_BASE}/posts/${post.id}` : `${API_BASE}/posts`;
    const method = isUpdate ? 'PUT' : 'POST';

    const postData = { ...post };
    if (!isUpdate) delete postData.id;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  } catch (error) {
    console.error('Failed to save post:', error);
    throw error;
  }
};

// 点赞文章
export const toggleLike = async (id: string): Promise<Post | undefined> => {
  try {
    const response = await fetch(`${API_BASE}/posts/${id}/like`, { method: 'POST' });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return { ...data.data, id: data.data._id };
  } catch (error) {
    console.error('Failed to like post:', error);
    return undefined;
  }
};

// 添加评论
export const addComment = async (postId: string, content: string, author?: string): Promise<Post | undefined> => {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, author }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);
    return { ...data.data, id: data.data._id };
  } catch (error) {
    console.error('Failed to add comment:', error);
    return undefined;
  }
};

// 删除文章
export const deletePost = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!data.success) throw new Error(data.error);
  } catch (error) {
    console.error('Failed to delete post:', error);
    throw error;
  }
};
