'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Car, Shield, Activity, Home, Bug, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const services = [
  {
    id: 'VHI',
    title: 'ДМС',
    description: 'Добровольное медицинское страхование для вас и вашей семьи. Прямой доступ к лучшим клиникам.',
    icon: Activity,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    id: 'CASCO',
    title: 'КАСКО',
    description: 'Полная защита вашего автомобиля от угона, ущерба и стихийных бедствий.',
    icon: Shield,
    color: 'bg-green-50 text-green-600',
  },
  {
    id: 'OSAGO',
    title: 'ОСАГО',
    description: 'Обязательное страхование автогражданской ответственности. Быстрое оформление и надежная поддержка.',
    icon: Car,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    id: 'Property',
    title: 'Страхование имущества',
    description: 'Защитите свой дом, квартиру или дачу от пожара, залива и кражи.',
    icon: Home,
    color: 'bg-purple-50 text-purple-600',
  },
  {
    id: 'Anti-tick',
    title: 'Антиклещ',
    description: 'Важная сезонная защита для любителей отдыха на природе и семей с детьми.',
    icon: Bug,
    color: 'bg-red-50 text-red-600',
  },
];

export const Services = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-black text-gray-900 md:text-5xl">
            Индивидуальная <span className="text-blue-600">защита</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Я предлагаю широкий спектр страховых продуктов от РЕСО-Гарантия — одного из самых надежных страховщиков России.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-6">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${service.color}`}>
                  <service.icon className="h-8 w-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
              
              <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                <Button variant="ghost" className="px-0 hover:bg-transparent text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                  Подробнее <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
