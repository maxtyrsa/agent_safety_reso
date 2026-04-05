'use client';

import React from 'react';
import { Shield, Phone, Mail, MapPin, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 pt-24 pb-12 text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight">РЕСО</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Профессионал</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Официальный агент РЕСО-Гарантия. Надежные страховые решения для частных лиц и бизнеса с 2010 года.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="rounded-lg bg-gray-800 p-2 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg bg-gray-800 p-2 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg bg-gray-800 p-2 text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold">Быстрые ссылки</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#services" className="hover:text-blue-400 transition-colors">Наши услуги</a></li>
              <li><a href="#calculator" className="hover:text-blue-400 transition-colors">Калькулятор</a></li>
              <li><a href="#news" className="hover:text-blue-400 transition-colors">Новости</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition-colors">Контакты</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold">Продукты</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">ДМС</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">КАСКО</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">ОСАГО</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Страхование имущества</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Антиклещ</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold">Контакты</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span>+7 (999) 123-45-67</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span>agent@reso-pro.ru</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span>Москва, ул. Тверская, 12</span>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-blue-400" />
                <span>Чат с Максом (24/7)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          <p>© 2026 Официальный агент РЕСО-Гарантия. Все права защищены. Не является публичной офертой.</p>
        </div>
      </div>
    </footer>
  );
};
