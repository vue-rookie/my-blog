import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPosts } from '../services/storageService';
import { Post, Category, CATEGORIES } from '@/src/types';
import { MessageSquare, ArrowRight, Hash, Search, Github, Mail, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | '全部'>('全部');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const filteredPosts = posts.filter(p => {
    const matchesCategory = selectedCategory === '全部' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getReadingTime = (content: string) => {
    const words = content.trim().length;
    return Math.ceil(words / 400); // Approximation for Chinese reading speed
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="space-y-12"
    >
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-10 pb-6 border-b border-stone-200">
        <div>
           <motion.h1 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-textMain tracking-tight mb-3"
          >
            秦强的博客
          </motion.h1>
          <p className="text-textMuted text-lg font-light tracking-wide">
            记录技术、生活与思考的碎片。
          </p>
        </div>

        {/* Search Bar - Claude Style */}
        <div className="relative w-full md:w-80">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <Search size={18} className="text-gray-400" />
           </div>
           <input 
             type="text" 
             placeholder="搜索文章..." 
             className="block w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-xl leading-5 text-textMain placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* Category Filter */}
           <div className="flex flex-wrap gap-2 pb-2">
             <button
               onClick={() => setSelectedCategory('全部')}
               className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${selectedCategory === '全部' ? 'bg-secondary text-white font-medium' : 'bg-transparent text-textMuted hover:bg-stone-200/50'}`}
             >
               全部
             </button>
             {CATEGORIES.map(cat => (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${selectedCategory === cat ? 'bg-primary text-white font-medium shadow-md shadow-orange-200' : 'bg-transparent text-textMuted hover:bg-stone-200/50'}`}
               >
                 {cat}
               </button>
             ))}
           </div>

           {/* Post List */}
           <motion.div 
             variants={container}
             animate="show"
             className="space-y-6"
           >
             {filteredPosts.length > 0 ? (
               filteredPosts.map(post => (
                 <motion.div key={post.id} variants={item}>
                   <Link to={`/post/${post.id}`} className="block group">
                     <article className="p-0 md:p-6  md:-mx-6 rounded-2xl hover:bg-white hover:shadow-warm transition-all duration-300 border border-transparent hover:border-stone-100 grid md:grid-cols-[1fr,200px] gap-6 items-start">
                       
                       {/* Text Content */}
                       <div className="flex flex-col gap-4">
                           <div className="flex items-center gap-3">
                             <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-md">
                               {post.category}
                             </span>
                             <span className="text-xs text-textMuted">
                               {getReadingTime(post.content)} 分钟阅读
                             </span>
                             <span className="text-xs text-textMuted mx-1">·</span>
                             <span className="text-xs text-textMuted">
                               {format(new Date(post.createdAt), 'yyyy年MM月dd日')}
                             </span>
                           </div>

                           <h2 className="text-2xl font-serif font-bold text-textMain group-hover:text-primary transition-colors leading-tight">
                             {post.title}
                           </h2>
                           
                           <p className="text-textMuted text-base leading-relaxed line-clamp-2">
                             {post.excerpt}
                           </p>

                           <div className="flex items-center gap-4 text-textMuted group-hover:text-primary/80 transition-colors pt-2">
                                 <span className="flex items-center gap-1 text-xs font-medium">
                                    阅读全文 <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                                 </span>
                                 <span className="flex items-center gap-1 text-xs ml-auto">
                                    <MessageSquare size={14} /> {post.comments.length}
                                 </span>
                           </div>
                       </div>

                       {/* Cover Image Thumbnail */}
                       {post.coverImage && (
                          <div className="hidden md:block w-full h-32 rounded-lg overflow-hidden shrink-0 border border-stone-100 shadow-sm">
                             <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                       )}

                     </article>
                   </Link>
                   <div className="h-px bg-stone-200/60 w-full mt-6" />
                 </motion.div>
               ))
             ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 border-dashed">
                  <p className="text-textMuted">没有找到相关文章。</p>
                </div>
             )}
           </motion.div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Profile Widget - Card Style */}
           <motion.div 
             initial={{ opacity: 0, x: 10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-white p-8 rounded-2xl shadow-card border border-stone-100 text-center"
           >
              <div className="w-24 h-24 mx-auto bg-stone-100 rounded-full p-1 mb-4">
                 <img 
                   src="https://api.dicebear.com/7.x/notionists/svg?seed=Qin" 
                   alt="Profile" 
                   className="w-full h-full rounded-full object-cover" 
                 />
              </div>
              <h3 className="text-xl font-serif font-bold text-textMain mb-1">秦强</h3>
              <p className="text-sm text-primary font-medium mb-4">前端开发工程师</p>
              
              <div className="text-sm text-textMuted space-y-2 mb-6 text-left bg-background p-4 rounded-xl">
                 <div className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span>山西至简能源科技有限公司</span>
                 </div>
                 <p className="text-xs leading-relaxed pt-2 border-t border-stone-200/60 mt-2">
                   热爱技术，追求至简。专注于 React 生态与现代化前端工程体验。
                 </p>
              </div>
              
              <div className="flex justify-center gap-4">
                 <button className="p-2 rounded-full bg-stone-50 text-textMuted hover:bg-stone-800 hover:text-white transition-all">
                    <Github size={18} />
                 </button>
                 <button className="p-2 rounded-full bg-stone-50 text-textMuted hover:bg-primary hover:text-white transition-all">
                    <Mail size={18} />
                 </button>
              </div>
           </motion.div>

           {/* Tags Cloud Widget */}
           <motion.div 
             initial={{ opacity: 0, x: 10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-white p-6 rounded-2xl border border-stone-100 shadow-card"
           >
              <h4 className="font-serif font-bold text-textMain mb-4 flex items-center gap-2">
                <Hash size={16} className="text-primary" /> 热门标签
              </h4>
              <div className="flex flex-wrap gap-2">
                 {['React', 'TypeScript', 'Tailwind', 'AI', '架构', '生活感悟', '性能优化', 'CSS'].map(tag => (
                   <span key={tag} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-background text-textMuted border border-transparent hover:border-primary hover:text-primary cursor-pointer transition-colors">
                      {tag}
                   </span>
                 ))}
              </div>
           </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Home;