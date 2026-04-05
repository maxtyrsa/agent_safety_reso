import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { validatePhone } from '@/lib/phoneValidator';

// Rate limiter: 5 запросов в минуту на один IP
const rateLimiter = new RateLimiterMemory({
  points: 5, // Максимум запросов
  duration: 60, // За 60 секунд (1 минута)
});

export async function POST(request: NextRequest) {
  try {
    // Получаем IP клиента
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Проверяем rate limit
    try {
      await rateLimiter.consume(ip);
    } catch {
      return NextResponse.json(
        {
          error: 'Слишком много запросов. Пожалуйста, подождите минуту перед следующей попыткой.',
        },
        { status: 429 }
      );
    }

    // Парсим тело запроса
    const body = await request.json();
    const { name, phone, email, product, message } = body;

    // Валидация обязательных полей
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Имя должно содержать минимум 2 символа' },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { error: 'Номер телефона обязателен' },
        { status: 400 }
      );
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
      return NextResponse.json(
        { error: phoneValidation.error || 'Неверный формат номера телефона' },
        { status: 400 }
      );
    }

    if (!product || !['VHI', 'CASCO', 'OSAGO', 'Property', 'Anti-tick'].includes(product)) {
      return NextResponse.json(
        { error: 'Выберите продукт страхования' },
        { status: 400 }
      );
    }

    // Сохраняем в Firestore
    const leadsRef = collection(db, 'leads');
    const docRef = await addDoc(leadsRef, {
      name: name.trim(),
      phone: phoneValidation.formatted || phone.trim(),
      email: email?.trim() || '',
      product,
      message: message?.trim() || '',
      status: 'new',
      createdAt: serverTimestamp(),
    });

    return NextResponse.json(
      { success: true, id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting lead:', error);
    return NextResponse.json(
      { error: 'Что-то пошло не так. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
}
