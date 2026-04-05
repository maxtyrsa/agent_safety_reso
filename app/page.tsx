'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Services } from '@/components/home/Services';
import { InsuranceCalculator } from '@/components/calculator/InsuranceCalculator';
import { LeadForm } from '@/components/forms/LeadForm';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from '@/lib/firebase';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  createdAt: any;
  author?: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(3));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsItem[];
      setNews(newsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'news');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <Hero />
      
      <section id="services">
        <Services />
      </section>
      
      <section id="calculator" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black text-gray-900 md:text-5xl">
              Калькулятор <span className="text-blue-600">премии</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Получите мгновенный расчет стоимости страховки. Просто, быстро и прозрачно.
            </p>
          </div>
          <InsuranceCalculator />
        </div>
      </section>

      <section id="news" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black text-gray-900 md:text-5xl">
              Последние <span className="text-blue-600">новости</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Будьте в курсе последних тенденций страхования, советов и обновлений компании.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-xl"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/600`}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex items-center space-x-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{item.createdAt?.toDate().toLocaleDateString() || 'Недавно'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{item.author || 'Админ'}</span>
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mb-6 flex-1 text-sm text-gray-600 line-clamp-3">
                      {item.excerpt || item.content.substring(0, 150) + '...'}
                    </p>
                    <button className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700">
                      Читать далее <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 italic">
              Новостей пока нет. Заходите позже!
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center lg:flex-row lg:space-x-12">
            <div className="mb-12 flex-1 lg:mb-0">
              <h2 className="mb-6 text-4xl font-black text-gray-900 md:text-5xl">
                Готовы <span className="text-blue-600">защитить</span> свое будущее?
              </h2>
              <p className="mb-8 text-xl text-gray-600">
                Не ждите непредвиденных ситуаций. Давайте подберем правильную защиту для вас уже сегодня. Я доступен для бесплатной консультации по телефону, почте или в мессенджере.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Часы работы</h4>
                    <p className="text-sm text-gray-500">Пн - Пт: 9:00 - 20:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Личный подход</h4>
                    <p className="text-sm text-gray-500">Прямое общение с вашим агентом.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full max-w-xl flex-1">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
