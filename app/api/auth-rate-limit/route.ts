import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter для авторизации: 10 запросов в минуту на один IP
const authRateLimiter = new RateLimiterMemory({
  points: 10, // Максимум запросов
  duration: 60, // За 60 секунд (1 минута)
});

/**
 * Проверяет, не превышен ли лимит попыток авторизации
 * POST /api/auth-rate-limit
 * Тело: { action: 'login' | 'check' }
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const body = await request.json();
    const { action } = body;

    if (action === 'check') {
      // Просто проверяем текущий статус
      const remaining = await authRateLimiter.get(ip);
      return NextResponse.json({
        allowed: true,
        remainingPoints: remaining?.remainingPoints ?? 0,
        msBeforeNext: remaining?.msBeforeNext ?? 0,
      });
    }

    if (action === 'login') {
      // Потребляем точку
      try {
        const result = await authRateLimiter.consume(ip);
        return NextResponse.json({
          allowed: true,
          remainingPoints: result.remainingPoints,
          msBeforeNext: result.msBeforeNext,
        });
      } catch (rateLimiterRes) {
        const rlRes = rateLimiterRes as any;
        return NextResponse.json(
          {
            allowed: false,
            error: 'Слишком много попыток входа. Пожалуйста, подождите минуту перед следующей попыткой.',
            msBeforeNext: rlRes.msBeforeNext,
          },
          { status: 429 }
        );
      }
    }

    return NextResponse.json({ error: 'Неверный action' }, { status: 400 });
  } catch (error) {
    console.error('Auth rate limit error:', error);
    return NextResponse.json(
      { error: 'Ошибка проверки лимита' },
      { status: 500 }
    );
  }
}
