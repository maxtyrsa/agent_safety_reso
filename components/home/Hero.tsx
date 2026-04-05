'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Phone, MessageCircle } from 'lucide-react';
import Image from 'next/image';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center lg:flex-row lg:space-x-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center space-x-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              <ShieldCheck className="h-4 w-4" />
              <span>Официальный агент РЕСО-Гарантия</span>
            </div>
            
            <h1 className="text-5xl font-black leading-tight text-gray-900 md:text-7xl">
              Страхование с <span className="text-blue-600">человеческим лицом</span>
            </h1>
            
            <p className="text-xl leading-relaxed text-gray-600 md:text-2xl">
              Привет! Я ваш персональный страховой эксперт. Помогаю семьям и бизнесу найти идеальную защиту без лишних сложностей.
            </p>
            
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto">
                Получить расчет
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <MessageCircle className="mr-2 h-5 w-5" />
                Написать в мессенджер
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-6 pt-4 lg:justify-start">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-gray-500">На связи</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">+7 (999) 123-45-67</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-16 flex-1 lg:mt-0"
          >
            <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="https://picsum.photos/seed/insurance-agent/800/800"
                alt="Страховой агент"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
            </div>
            
            {/* Floating Stats */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-8 top-1/4 rounded-2xl bg-white p-4 shadow-xl"
            >
              <div className="text-2xl font-bold text-blue-600">15+</div>
              <div className="text-xs font-semibold text-gray-500 uppercase">Лет опыта</div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -right-8 bottom-1/4 rounded-2xl bg-white p-4 shadow-xl"
            >
              <div className="text-2xl font-bold text-green-600">5000+</div>
              <div className="text-xs font-semibold text-gray-500 uppercase">Довольных клиентов</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
