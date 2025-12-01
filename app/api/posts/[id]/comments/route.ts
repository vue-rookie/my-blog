import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Post } from '@/models/Post';

// POST /api/posts/[id]/comments - 添加评论
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { content, author } = await request.json();

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const newComment = {
      id: crypto.randomUUID(),
      author: author,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(author || 'Guest')}&size=80&background=random&color=fff&bold=true&format=svg`,
      content,
      createdAt: Date.now(),
    };

    post.comments.push(newComment);
    await post.save();

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
