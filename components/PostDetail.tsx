'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share2, Bot, Trash2, ArrowLeft, Clock, Edit, Copy, Check } from 'lucide-react';
import { getPostById, toggleLike, addComment, deletePost } from '@/src/services/storageService';
import { generateSummary } from '@/src/services/geminiService';
import { Post } from '@/src/types';
import { useAuth } from '@/src/context/AuthContext';
import rehypeHighlight from "rehype-highlight";

interface PostDetailProps {
  id: string;
}

const PostDetail: React.FC<PostDetailProps> = ({ id }) => {
  const router = useRouter();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        const data = await getPostById(id);
        if (data) setPost(data);
      };
      fetchPost();
    }
  }, [id]);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-textMuted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p>加载中...</p>
      </div>
    );
  }

  const getReadingTime = (content: string) => {
    const words = content.trim().length;
    return Math.ceil(words / 400);
  };

  const handleLike = async () => {
    if (id) {
      const updated = await toggleLike(id);
      if (updated) {
        setPost(updated);
        setHasLiked(true);
      }
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentAuthor.trim() || !id) return;
    const updated = await addComment(id, commentText, commentAuthor);
    if (updated) {
      setPost(updated);
      setCommentText('');
      setCommentAuthor('');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("确定要删除这篇文章吗？")) {
      if (post.id) {
        await deletePost(post.id);
        router.push('/');
      }
    }
  }

  const handleEdit = () => {
    router.push(`/edit/${post.id}`);
  }

  const handleAISummary = async () => {
    setLoadingAi(true);
    const summary = await generateSummary(post.content);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-3xl mx-auto"
    >
      <Link href="/" className="inline-flex items-center gap-2 text-textMuted hover:text-primary mb-8 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> 返回首页
      </Link>

      {/* Article Header */}
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-md bg-stone-200/50 text-textMuted text-xs font-bold tracking-wide uppercase">
            {post.category}
          </span>
          <span className="text-textMuted text-xs font-medium flex items-center gap-1">
             <Clock size={12} /> {getReadingTime(post.content)} 分钟阅读
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 leading-tight text-textMain">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-2 text-textMuted text-sm">
           <span className="font-medium text-primary">{post.author}</span>
           <span>•</span>
           <span>{format(new Date(post.createdAt), 'yyyy年MM月dd日')}</span>
           <span>•</span>
           <span>{post.views} 阅读</span>
        </div>
      </header>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-warm">
           <img src={post.coverImage} alt={post.title} className="w-full max-h-[400px] object-cover" />
        </div>
      )}

      {/* Main Content Card - Paper Style */}
      <div className="rounded-none md:rounded-3xl px-4 py-6   md:border md:border-stone-100">

        {/* Actions Bar */}
        {isAdmin && (
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-stone-100">
             <button
               onClick={handleAISummary}
               disabled={loadingAi}
               className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-primary hover:bg-orange-100 transition-colors text-sm font-bold disabled:opacity-50"
             >
               <Bot size={16} className={loadingAi ? 'animate-pulse' : ''} />
               {loadingAi ? '生成中...' : 'AI 摘要'}
             </button>

             <div className="flex gap-2">
                <button onClick={handleEdit} className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-stone-50 rounded-lg">
                    <Edit size={18} />
                </button>
                <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-stone-50 rounded-lg">
                    <Trash2 size={18} />
                </button>
             </div>
          </div>
        )}

        {/* AI Summary Result */}
        {aiSummary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-10 p-6 rounded-xl bg-background border border-stone-200 text-textMain"
          >
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3 text-primary">
              <SparklesIcon /> AI 智能摘要
            </h3>
            <p className="leading-relaxed text-textMuted font-serif">{aiSummary}</p>
          </motion.div>
        )}

        {/* Markdown Content */}
        <div className="prose max-w-none markdown ">
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={{
            pre({ node, className, children, ...props }) {
              return (
                <CodeBlock className={className} {...props}>
                  {children}
                </CodeBlock>
              );
            }
          }}>
            {post.content}
          </Markdown>
        </div>

        {/* Engagement Footer */}
        <div className="mt-16 pt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300 ${hasLiked ? 'bg-primary text-white shadow-md shadow-orange-200' : 'bg-background hover:bg-stone-100 text-textMuted border border-stone-200'}`}
            >
              <Heart size={18} fill={hasLiked ? "currentColor" : "none"} className={hasLiked ? "animate-bounce" : ""} />
              <span className="font-bold text-sm">{post.likes}</span>
            </button>
            {/* <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-background hover:bg-stone-100 text-textMuted border border-stone-200 transition-all text-sm">
               <Share2 size={18} />
               <span className="font-medium">分享</span>
            </button> */}
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
             {post.tags.map(tag => (
               <span key={tag} className="text-xs text-textMuted border border-stone-200 px-3 py-1 rounded-lg bg-background hover:border-primary hover:text-primary transition-colors cursor-default">#{tag}</span>
             ))}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-16 max-w-2xl mx-auto pb-12">
        <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-3 text-textMain">
          <div className="p-1.5 bg-background rounded-lg text-textMuted">
            <MessageCircle size={20} />
          </div>
          评论 ({post.comments.length})
        </h3>

        <form onSubmit={handleComment} className="mb-10 space-y-4">
          <input
            type="text"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            placeholder="您的昵称..."
            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-textMain focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-300 shadow-sm"
          />
          <div className="relative group">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="写下您的想法..."
              className="w-full bg-white border border-stone-200 rounded-xl p-4 text-textMain focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[120px] resize-none placeholder:text-gray-300 shadow-sm"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || !commentAuthor.trim()}
              className="absolute bottom-4 right-4 px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              发表评论
            </button>
          </div>
        </form>

        <div className="space-y-8">
          {post.comments.map(comment => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="shrink-0">
                 <img src={comment.avatar} alt="avatar" className="w-10 h-10 rounded-full bg-stone-100" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-textMain text-sm">{comment.author}</span>
                  <span className="text-xs text-gray-400">{format(new Date(comment.createdAt), 'MM月dd日 HH:mm')}</span>
                </div>
                <p className="text-textMuted text-sm leading-relaxed">{comment.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SparklesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.39 9.66L22 12L14.39 14.34L12 22L9.61 14.34L2 12L9.61 9.66L12 2Z" fill="currentColor"/>
  </svg>
);

const CodeBlock: React.FC<React.HTMLAttributes<HTMLPreElement>> = ({ children, className, ...props }) => {
  const [copied, setCopied] = useState(false);

  const getCodeText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getCodeText).join('');
    if (React.isValidElement(node)) {
      const props = node.props as { children?: React.ReactNode };
      if (props.children) {
        return getCodeText(props.children);
      }
    }
    return '';
  };

  const handleCopy = async () => {
    const codeText = getCodeText(children);
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group">
      <pre className={`${className ? className : ""} rounded-md p-4`} {...props}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-stone-700/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-600"
        title={copied ? '已复制' : '复制代码'}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
};

export default PostDetail;
