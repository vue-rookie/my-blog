'use client';

import { use } from 'react';
import PostDetail from '@/components/PostDetail';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <PostDetail id={id} />;
}
