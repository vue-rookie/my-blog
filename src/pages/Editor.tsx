import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { savePost, getPostById } from '../services/storageService';
import { generateTitleAndTags } from '../services/geminiService';
import { CATEGORIES, Category, Post } from '../types';
import { 
  Save, Eye, Wand2, 
  Undo, Redo, 
  Bold, Italic, Underline, Strikethrough, 
  List, ListOrdered, 
  Quote, Code, Link as LinkIcon, Image as ImageIcon,
  Columns, LayoutPanelLeft, ImagePlus, RefreshCw
} from 'lucide-react';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load existing data if editing
  const existingPost = id ? getPostById(id) : undefined;

  const [title, setTitle] = useState(existingPost?.title || '');
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || '');
  const [content, setContent] = useState(existingPost?.content || '');
  const [coverImage, setCoverImage] = useState(existingPost?.coverImage || '');
  const [category, setCategory] = useState<Category>(existingPost?.category as Category || '技术');
  const [tags, setTags] = useState<string>(existingPost?.tags.join(', ') || '');
  
  // Modes: 'edit' (only editor), 'preview' (only preview), 'split' (side by side)
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-switch to single view on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && viewMode === 'split') {
        setViewMode('edit');
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSave = () => {
    if (!title || !content) {
      alert('标题和内容不能为空！');
      return;
    }

    const newPost: Post = {
      id: existingPost?.id || crypto.randomUUID(),
      title,
      excerpt: excerpt || content.substring(0, 100) + '...',
      content,
      coverImage: coverImage || `https://picsum.photos/seed/${Date.now()}/800/400`,
      category,
      tags: tags.split(/[,，]/).map(t => t.trim()).filter(Boolean),
      author: '秦强',
      createdAt: existingPost?.createdAt || Date.now(),
      likes: existingPost?.likes || 0,
      views: existingPost?.views || 0,
      comments: existingPost?.comments || []
    };

    savePost(newPost);
    navigate('/');
  };

  const handleMagic = async () => {
    if (content.length < 20) {
      alert("请多写一点内容，以便 AI 更好地辅助你！");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateTitleAndTags(content);
      setTitle(result.title);
      setTags(result.tags.join(', '));
      if (!excerpt) {
        setExcerpt("AI 根据内容自动生成的摘要...");
      }
    } catch (e) {
      console.error(e);
      alert("AI 生成失败，请检查 API Key");
    } finally {
      setIsGenerating(false);
    }
  };

  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selection.length + suffix.length;
      textarea.setSelectionRange(
        selection.length > 0 ? newCursorPos : start + prefix.length,
        newCursorPos
      );
    }, 0);
  };

  const randomCover = () => {
    setCoverImage(`https://picsum.photos/seed/${Date.now()}/800/400`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1400px] mx-auto pb-20"
    >
      {/* Top Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-bold text-textMain">
          {id ? '编辑文章' : '新文章'}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleMagic}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-primary hover:bg-orange-100 transition-colors text-sm font-medium border border-orange-100"
          >
            <Wand2 size={16} className={isGenerating ? "animate-spin" : ""} />
            {isGenerating ? "生成中..." : "AI 助手"}
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white hover:bg-accent transition-colors text-sm font-bold shadow-md shadow-orange-200"
          >
            <Save size={16} />
            发布
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="space-y-6">
        
        {/* Title Input */}
        <input
          type="text"
          placeholder="输入标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-4xl md:text-5xl font-serif font-bold text-textMain placeholder:text-stone-300 focus:outline-none border-none p-0"
        />

        {/* Settings Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Category & Tags */}
          <div className="md:col-span-8 flex flex-col md:flex-row gap-4">
             <div className="relative min-w-[140px]">
                <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full appearance-none bg-white border border-stone-200 rounded-lg pl-4 pr-10 py-3 text-sm text-textMain focus:outline-none focus:border-primary shadow-sm cursor-pointer"
                >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
             </div>
             
             <input
               type="text"
               placeholder="标签 (逗号分隔)"
               value={tags}
               onChange={(e) => setTags(e.target.value)}
               className="flex-1 bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm text-textMain focus:outline-none focus:border-primary shadow-sm"
             />
          </div>

          {/* Cover Image Input */}
          <div className="md:col-span-4 flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <ImagePlus size={16} />
              </div>
              <input 
                type="text" 
                placeholder="封面图片链接..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full pl-9 pr-3 py-3 bg-white border border-stone-200 rounded-lg text-sm text-textMain focus:outline-none focus:border-primary shadow-sm"
              />
            </div>
            <button 
              onClick={randomCover} 
              className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-500 hover:text-primary hover:border-primary transition-colors"
              title="随机封面"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Cover Preview (if exists) */}
        {coverImage && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-xl overflow-hidden h-48 w-full relative group">
             <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => setCoverImage('')} className="bg-white/90 text-red-500 px-3 py-1 rounded-md text-sm font-bold shadow-sm">移除封面</button>
             </div>
          </motion.div>
        )}

        {/* Excerpt */}
        <textarea
           value={excerpt}
           onChange={(e) => setExcerpt(e.target.value)}
           placeholder="输入摘要..."
           className="w-full bg-white border border-stone-200 rounded-xl p-4 text-textMuted text-sm focus:outline-none focus:border-primary h-20 resize-none shadow-sm placeholder:text-stone-300"
        />

        {/* Editor Main Container */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col relative">
          
          {/* Toolbar */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-stone-100 p-2 flex flex-wrap items-center justify-between gap-2 select-none">
            
            <div className="flex items-center gap-1 flex-wrap">
               {/* Headings */}
               <button onClick={() => insertFormat('# ')} className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg font-serif font-bold text-sm w-9 transition-colors">H1</button>
               <button onClick={() => insertFormat('## ')} className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg font-serif font-bold text-sm w-9 transition-colors">H2</button>
               
               <div className="w-px h-5 bg-stone-200 mx-1" />

               {/* Formatting */}
               <button onClick={() => insertFormat('**', '**')} className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"><Bold size={18} /></button>
               <button onClick={() => insertFormat('*', '*')} className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"><Italic size={18} /></button>
               <button onClick={() => insertFormat('~~', '~~')} className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"><Strikethrough size={18} /></button>

               <div className="w-px h-5 bg-stone-200 mx-1" />

               {/* Lists & Inserts */}
               <button onClick={() => insertFormat('- ')} className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"><List size={18} /></button>
               <button onClick={() => insertFormat('\n\n> ')} className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"><Quote size={18} /></button>
               <button onClick={() => insertFormat('```\n', '\n```')} className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"><Code size={18} /></button>
               <button onClick={() => insertFormat('[链接](url)')} className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"><LinkIcon size={18} /></button>
               <button onClick={() => insertFormat('![图片](url)')} className="p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors"><ImageIcon size={18} /></button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-stone-100 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('edit')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'edit' ? 'bg-white text-primary shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                title="仅编辑"
              >
                <LayoutPanelLeft size={16} />
              </button>
              <button 
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-md transition-all hidden lg:block ${viewMode === 'split' ? 'bg-white text-primary shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                title="分屏预览"
              >
                <Columns size={16} />
              </button>
              <button 
                onClick={() => setViewMode('preview')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'preview' ? 'bg-white text-primary shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                title="仅预览"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>

          {/* Editor/Preview Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Textarea */}
            {(viewMode === 'edit' || viewMode === 'split') && (
              <div className={`h-full flex flex-col ${viewMode === 'split' ? 'w-1/2 border-r border-stone-200' : 'w-full'}`}>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-1 w-full p-6 text-base leading-relaxed text-textMain font-mono focus:outline-none resize-none bg-stone-50/30 placeholder:text-stone-300"
                  placeholder="在此输入 Markdown 内容..."
                  spellCheck={false}
                />
              </div>
            )}

            {/* Right: Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className={`h-full overflow-y-auto bg-white ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                 <div className="p-8 md:p-12 prose prose-stone max-w-none prose-headings:font-serif prose-a:text-primary">
                    <h1 className="font-serif font-bold text-4xl mb-6">{title || "文章预览"}</h1>
                    {coverImage && <img src={coverImage} alt="Cover" className="w-full rounded-xl mb-8" />}
                    <ReactMarkdown>{content}</ReactMarkdown>
                 </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Editor;