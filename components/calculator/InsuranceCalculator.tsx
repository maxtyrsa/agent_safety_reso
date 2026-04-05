'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Car, Shield, Home, Activity, Bug, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type InsuranceType = 'OSAGO' | 'CASCO' | 'VHI' | 'Property' | 'Anti-tick';

export const InsuranceCalculator = () => {
  const [type, setType] = useState<InsuranceType>('OSAGO');
  const [value, setValue] = useState<number>(1000000); // For property or car value
  const [age, setAge] = useState<number>(30);
  const [experience, setExperience] = useState<number>(5);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const estimate = useMemo(() => {
    let base = 0;
    switch (type) {
      case 'OSAGO':
        base = 5000 + (experience < 3 ? 2000 : 0) + (age < 25 ? 1500 : 0);
        break;
      case 'CASCO':
        base = value * 0.04 + (experience < 5 ? 5000 : 0);
        break;
      case 'VHI':
        base = 15000 + (age > 45 ? 10000 : 0);
        break;
      case 'Property':
        base = value * 0.001;
        break;
      case 'Anti-tick':
        base = 500;
        break;
    }
    return Math.round(base);
  }, [type, value, age, experience]);

  const insuranceTypes: { id: InsuranceType; label: string; icon: any }[] = [
    { id: 'OSAGO', label: 'ОСАГО', icon: Car },
    { id: 'CASCO', label: 'КАСКО', icon: Shield },
    { id: 'VHI', label: 'ДМС', icon: Activity },
    { id: 'Property', label: 'Имущество', icon: Home },
    { id: 'Anti-tick', label: 'Антиклещ', icon: Bug },
  ];

  return (
    <div className="rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">
      <div className="mb-8 flex flex-wrap gap-3">
        {insuranceTypes.map((item) => (
          <button
            key={item.id}
            onClick={() => setType(item.id)}
            className={cn(
              'flex items-center space-x-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all',
              type === item.id
                ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-600 ring-offset-2'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {(type === 'CASCO' || type === 'Property') && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-semibold text-gray-700">
                      {type === 'CASCO' ? 'Стоимость автомобиля' : 'Стоимость имущества'}
                    </label>
                    <span className="text-sm font-bold text-blue-600">
                      {mounted ? value.toLocaleString() : value} ₽
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={10000000}
                    step={100000}
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                  />
                </div>
              )}

              {(type === 'OSAGO' || type === 'CASCO' || type === 'VHI') && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-semibold text-gray-700">Возраст</label>
                    <span className="text-sm font-bold text-blue-600">{age} лет</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={80}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                  />
                </div>
              )}

              {(type === 'OSAGO' || type === 'CASCO') && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-semibold text-gray-700">Стаж вождения</label>
                    <span className="text-sm font-bold text-blue-600">{experience} лет</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                  />
                </div>
              )}

              {type === 'Anti-tick' && (
                <div className="flex items-start space-x-3 rounded-xl bg-blue-50 p-4 text-blue-800">
                  <Info className="mt-0.5 h-5 w-5 flex-shrink-0" />
                  <p className="text-sm">
                    Стандартная защита на одного человека. Включает лечение и лабораторные исследования.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-8 text-center">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Ориентировочная стоимость</p>
          <motion.h2
            key={estimate}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="my-2 text-5xl font-black text-blue-900"
          >
            {mounted ? estimate.toLocaleString() : estimate} ₽
          </motion.h2>
          <p className="mb-6 text-xs text-gray-400">
            *Это предварительный расчет. Финальная цена зависит от ваших документов.
          </p>
          <Button variant="primary" size="lg" className="w-full">
            Получить точный расчет
          </Button>
        </div>
      </div>
    </div>
  );
};
