"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PenTool, Home, Lock, Unlock, X, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isAdmin, login, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(passwordInput)) {
      setShowLoginModal(false);
      setPasswordInput('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen relative text-textMain selection:bg-primary/20 selection:text-primary">
      {/* Navbar - Clean Floating Island */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 px-2 py-2 bg-surface border border-gray-200/60 rounded-full shadow-warm">
          
          <Link href="/" className={`p-3 rounded-full transition-all duration-300 ${isActive('/') ? 'bg-primary text-white' : 'hover:bg-gray-100 text-textMuted hover:text-textMain'}`}>
            <Home size={22} />
          </Link>

          {isAdmin && (
            <>
            <div className="w-px h-5 bg-gray-200 mx-1"></div>
            <Link href="/write" className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 ${isActive('/write') ? 'bg-secondary text-white font-medium' : 'hover:bg-gray-100 text-textMuted hover:text-textMain'}`}>
              <PenTool size={18} />
              <span className={`${isActive('/write') ? 'block' : 'hidden md:block'} text-sm`}>写作</span>
            </Link>
            </>
          )}

          <div className="w-px h-5 bg-gray-200 mx-1"></div>

          {/* Auth Trigger */}
          <button 
            onClick={() => isAdmin ? logout() : setShowLoginModal(true)}
            className={`p-3 rounded-full transition-all duration-300 ${isAdmin ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-textMuted hover:bg-gray-100 hover:text-textMain'}`}
            title={isAdmin ? "退出管理" : "管理员登录"}
          >
             {isAdmin ? <Unlock size={20} /> : <Lock size={20} />}
          </button>

        </div>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-800/20 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              className="bg-surface rounded-2xl p-8 shadow-2xl max-w-sm w-full relative border border-gray-100"
            >
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center mb-6">
                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                   <LogIn size={24} />
                 </div>
                 <h2 className="text-xl font-serif font-bold text-textMain">管理员验证</h2>
                 <p className="text-sm text-textMuted mt-1">请输入密钥以管理博客内容</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                   <input 
                     type="password" 
                     placeholder="输入密码 (试一下 'nebula')"
                     className={`w-full px-4 py-3 rounded-lg bg-background border ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary'} outline-none transition-all text-sm`}
                     value={passwordInput}
                     onChange={(e) => {
                       setPasswordInput(e.target.value);
                       setError(false);
                     }}
                     autoFocus
                   />
                   {error && <p className="text-xs text-red-500 mt-1 ml-1">密码错误</p>}
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-accent transition-all shadow-sm"
                >
                  解锁
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 pb-32 max-w-6xl">
        {children}
      </main>
    </div>
  );
};