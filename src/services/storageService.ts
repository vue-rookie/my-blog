import { Post, Comment } from '../types';

const STORAGE_KEY = 'nebula_blog_posts';

// Initial Seed Data
const SEED_POSTS: Post[] = [
  {
    id: '1',
    title: '界面设计的未来：温暖与极简',
    excerpt: '探索 Web 设计如何从冷酷的科技风转向更具人文关怀的温暖极简主义。',
    content: `# 温暖的极简主义\n\n用户界面正在迅速演变。我们正在从扁平化设计、高饱和度的科技感，转向一种更有深度、更温暖、更像纸张的阅读体验。\n\n## 为什么选择米色背景？\n\n长时间阅读纯白色背景会让眼睛疲劳。受 Claude 和 Notion 等现代工具的启发，柔和的米色（Off-white）背景能提供更舒适的对比度。\n\n> "设计不仅是外观，更是感受。"\n\n看看这个简单的 CSS 变量设置：\n\n\`\`\`css\n:root {\n  --bg-color: #F5F3EF;\n  --text-primary: #333333;\n  --accent: #DA7756;\n}\n\`\`\`\n\n## 字体的重要性\n\n衬线体（Serif）回归了。在标题中使用衬线体可以带来一种经典的、权威的、类似于印刷品的质感，而正文使用无衬线体则保证了屏幕阅读的清晰度。`,
    category: '设计',
    tags: ['UI', 'UX', '设计趋势'],
    coverImage: 'https://picsum.photos/800/400?random=1',
    author: '秦强',
    createdAt: Date.now() - 100000000,
    likes: 42,
    views: 1205,
    comments: [
      {
        id: 'c1',
        author: '李明',
        content: '写得很棒！这种风格确实让人看着很舒服。',
        createdAt: Date.now() - 5000000,
        avatar: 'https://picsum.photos/50/50?random=10'
      }
    ]
  },
  {
    id: '2',
    title: '前端开发的至简之道',
    excerpt: '在复杂的框架洪流中，如何保持代码的简洁与高效？',
    content: `# 保持简单\n\n在至简能源科技工作的这段时间，我深刻体会到“至简”不仅仅是一个公司名字，更是一种开发哲学。\n\n1. **如无必要，勿增实体**：不要为了用库而用库。\n2. **类型安全**：TypeScript 是大型项目的基石。\n3. **组件化**：让每个组件只做一件事，并把它做好。\n\n前端的世界很嘈杂，我们需要学会做减法。`,
    category: '技术',
    tags: ['TypeScript', 'React', '心得'],
    coverImage: 'https://picsum.photos/800/400?random=2',
    author: '秦强',
    createdAt: Date.now() - 20000000,
    likes: 128,
    views: 3400,
    comments: []
  }
];

export const getPosts = (): Post[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS));
    return SEED_POSTS;
  }
  return JSON.parse(data);
};

export const getPostById = (id: string): Post | undefined => {
  const posts = getPosts();
  return posts.find(p => p.id === id);
};

export const savePost = (post: Post): void => {
  const posts = getPosts();
  const existingIndex = posts.findIndex(p => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.unshift(post);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

export const toggleLike = (id: string): Post | undefined => {
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (post) {
    post.likes += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return post;
  }
  return undefined;
};

export const addComment = (postId: string, content: string): Post | undefined => {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (post) {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: '访客',
      content,
      createdAt: Date.now(),
      avatar: `https://picsum.photos/50/50?random=${Date.now()}`
    };
    post.comments.unshift(newComment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return post;
  }
  return undefined;
};

export const deletePost = (id: string): void => {
  const posts = getPosts();
  const newPosts = posts.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
}