'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Menu, X, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Услуги', href: '#services' },
    { label: 'Калькулятор', href: '#calculator' },
    { label: 'Новости', href: '#news' },
    { label: 'Контакты', href: '#contact' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
              <Shield className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-gray-900">РЕСО</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Профессионал</span>
            </div>
          </div>

          <div className="hidden items-center space-x-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-bold text-gray-600 transition-colors hover:text-blue-600"
              >
                {link.label}
              </a>
            ))}
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center space-x-4">
              <a href="tel:+79991234567" className="flex items-center space-x-2 text-sm font-bold text-gray-900">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>+7 (999) 123-45-67</span>
              </a>
              <Button size="sm">Заказать расчет</Button>
            </div>
          </div>

          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white lg:hidden"
          >
            <div className="space-y-4 px-6 py-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-bold text-gray-900"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 space-y-4">
                <Button className="w-full">Заказать расчет</Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Написать Максу
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
