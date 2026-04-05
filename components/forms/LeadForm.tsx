'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().min(10, 'Пожалуйста, введите корректный номер телефона'),
  email: z.string().email('Пожалуйста, введите корректный email').optional().or(z.literal('')),
  product: z.enum(['VHI', 'CASCO', 'OSAGO', 'Property', 'Anti-tick']),
  message: z.string().max(500, 'Сообщение слишком длинное').optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export const LeadForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      product: 'OSAGO',
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setError(null);
    try {
      const leadsRef = collection(db, 'leads');
      await addDoc(leadsRef, {
        ...data,
        status: 'new',
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
      reset();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'leads');
      setError('Что-то пошло не так. Пожалуйста, попробуйте позже.');
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center space-y-4 rounded-2xl bg-green-50 p-8 text-center"
      >
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h3 className="text-2xl font-bold text-green-800">Заявка отправлена!</h3>
        <p className="text-green-700">
          Спасибо за обращение. Я свяжусь с вами в ближайшее время для обсуждения ваших потребностей в страховании.
        </p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Отправить еще одну заявку
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Бесплатная консультация</h3>
        <p className="text-gray-600">Оставьте свои данные, и я помогу вам подобрать лучшую страховку.</p>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">ФИО *</label>
          <input
            {...register('name')}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Иван Иванов"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Номер телефона *</label>
          <input
            {...register('phone')}
            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder="+7 (999) 000-00-00"
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Продукт страхования *</label>
        <select
          {...register('product')}
          className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="VHI">ДМС - Добровольное мед. страхование</option>
          <option value="CASCO">КАСКО - Полная защита авто</option>
          <option value="OSAGO">ОСАГО - Обязательное страхование</option>
          <option value="Property">Страхование имущества</option>
          <option value="Anti-tick">Антиклещ</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Сообщение (необязательно)</label>
        <textarea
          {...register('message')}
          rows={3}
          className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Расскажите подробнее о ваших пожеланиях..."
        />
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Отправить заявку
      </Button>

      <p className="text-center text-xs text-gray-500">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
      </p>
    </form>
  );
};
