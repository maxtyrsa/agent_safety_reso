'use client';

import React, { useState, useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType, testConnection } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, LayoutDashboard, FileText, Users, LogOut, Plus, Trash2, CheckCircle, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const ADMIN_EMAIL = "max200779@gmail.com";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'news'>('leads');
  const [leads, setLeads] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newNews, setNewNews] = useState({ title: '', content: '', excerpt: '' });
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    testConnection();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.email === ADMIN_EMAIL) {
      const leadsQuery = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const newsQuery = query(collection(db, 'news'), orderBy('createdAt', 'desc'));

      const unsubLeads = onSnapshot(leadsQuery, (snapshot) => {
        setLeads(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'leads'));

      const unsubNews = onSnapshot(newsQuery, (snapshot) => {
        setNews(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'news'));

      return () => {
        unsubLeads();
        unsubNews();
      };
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const handleLogout = () => auth.signOut();

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'news'), {
        ...newNews,
        createdAt: serverTimestamp(),
        author: user?.displayName || 'Админ',
      });
      setIsAddingNews(false);
      setNewNews({ title: '', content: '', excerpt: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'news');
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'news', id));
      setConfirmingDeleteId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'news');
    }
  };

  const handleUpdateLeadStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'leads', id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'leads');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-6 py-24">
          <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-12 text-center shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Shield className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-gray-900">Админ-панель</h2>
              <p className="text-gray-500">Пожалуйста, войдите через Google аккаунт для доступа к панели управления.</p>
            </div>
            <Button onClick={handleLogin} className="w-full" size="lg">
              Войти через Google
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-24">
        <div className="mb-12 flex flex-col items-start justify-between space-y-6 lg:flex-row lg:items-center lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Панель управления</h1>
              <p className="text-sm text-gray-500">С возвращением, {user.displayName}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>

        <div className="flex space-x-4 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('leads')}
            className={cn(
              'flex items-center space-x-2 border-b-2 px-4 py-4 text-sm font-bold transition-all',
              activeTab === 'leads' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <Users className="h-4 w-4" />
            <span>Заявки ({leads.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={cn(
              'flex items-center space-x-2 border-b-2 px-4 py-4 text-sm font-bold transition-all',
              activeTab === 'news' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <FileText className="h-4 w-4" />
            <span>Новости ({news.length})</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'leads' ? (
            <motion.div
              key="leads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {leads.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {leads.map((lead) => (
                    <div key={lead.id} className="flex flex-col items-start justify-between space-y-4 rounded-2xl bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:space-y-0">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-bold text-gray-900">{lead.name}</h3>
                          <span className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                            lead.status === 'new' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          )}>
                            {lead.status === 'new' ? 'Новая' : lead.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{lead.phone} • {lead.email || 'Нет email'}</p>
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{lead.product}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {lead.status === 'new' && (
                          <Button size="sm" variant="secondary" onClick={() => handleUpdateLeadStatus(lead.id, 'contacted')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Отметить как обработанную
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="text-gray-400">
                          <Clock className="mr-2 h-4 w-4" />
                          {lead.createdAt?.toDate().toLocaleString()}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500 italic">Заявок пока нет.</div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Управление новостями</h2>
                <Button onClick={() => setIsAddingNews(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить новость
                </Button>
              </div>

              {isAddingNews && (
                <motion.form
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onSubmit={handleAddNews}
                  className="space-y-4 rounded-2xl bg-white p-8 shadow-lg border border-blue-100"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Новая статья</h3>
                    <button type="button" onClick={() => setIsAddingNews(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Заголовок</label>
                    <input
                      required
                      value={newNews.title}
                      onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Краткое описание</label>
                    <input
                      value={newNews.excerpt}
                      onChange={(e) => setNewNews({ ...newNews, excerpt: e.target.value })}
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Контент</label>
                    <textarea
                      required
                      rows={5}
                      value={newNews.content}
                      onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button type="submit" className="w-full">Опубликовать</Button>
                </motion.form>
              )}

              <div className="grid grid-cols-1 gap-6">
                {news.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-sm">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.createdAt?.toDate().toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {confirmingDeleteId === item.id ? (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => setConfirmingDeleteId(null)}>Отмена</Button>
                          <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDeleteNews(item.id)}>Удалить</Button>
                        </div>
                      ) : (
                        <Button variant="ghost" onClick={() => setConfirmingDeleteId(item.id)} className="text-red-600 hover:bg-red-50">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </main>
  );
}
