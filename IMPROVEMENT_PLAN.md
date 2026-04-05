# 📋 Пошаговый план улучшений проекта

## Этап 1: Критическая безопасность (День 1)

### Шаг 1.1: Настройка переменных окружения
- [ ] Создать файл `.env.local` в корне проекта
- [ ] Добавить переменные:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
  ```
- [ ] Обновить `.gitignore`, добавив `.env.local` и `.env*.local`
- [ ] Создать `.env.example` с шаблонными значениями для документации
- [ ] Обновить `lib/firebase.ts` для использования `process.env`

### Шаг 1.2: Валидация телефона
- [ ] Установить библиотеку: `npm install libphonenumber-js`
- [ ] Создать утилиту `lib/phoneValidator.ts`:
  ```typescript
  import { parsePhoneNumberWithError } from 'libphonenumber-js'
  
  export function validatePhone(phone: string, country: string = 'RU'): boolean {
    try {
      const phoneNumber = parsePhoneNumberWithError(phone, country)
      return phoneNumber.isValid()
    } catch {
      return false
    }
  }
  
  export function formatPhone(phone: string, country: string = 'RU'): string {
    const phoneNumber = parsePhoneNumberWithError(phone, country)
    return phoneNumber.formatInternational()
  }
  ```
- [ ] Обновить компонент формы заявки с валидацией в реальном времени
- [ ] Добавить маску ввода для телефона

### Шаг 1.3: Rate Limiting
- [ ] Создать API route `/api/rate-limit` или использовать middleware
- [ ] Установить `npm install rate-limiter-flexible`
- [ ] Реализовать лимиты:
  - 5 запросов в минуту на отправку формы
  - 10 запросов в минуту на авторизацию
- [ ] Добавить обработку ошибок с понятными сообщениями пользователю

---

## Этап 2: Архитектура и типизация (День 2)

### Шаг 2.1: Типизация Firestore документов
- [ ] Создать файл `types/firestore.ts`:
  ```typescript
  export interface Lead {
    id?: string
    name: string
    phone: string
    service: string
    createdAt: FirebaseFirestore.Timestamp
    status: 'new' | 'contacted' | 'completed'
  }
  
  export interface User {
    uid: string
    email: string
    role: 'admin' | 'manager'
    createdAt: FirebaseFirestore.Timestamp
  }
  
  export interface Service {
    id: string
    name: string
    basePrice: number
    description: string
  }
  ```
- [ ] Обновить все функции работы с Firestore с использованием типов
- [ ] Добавить generics для hooks работы с данными

### Шаг 2.2: Рефакторинг авторизации
- [ ] Создать хук `hooks/useAuth.ts` с единой логикой
- [ ] Убрать дублирование из компонентов
- [ ] Создать Higher Order Component `withAuth` для защищённых страниц
- [ ] Добавить контекст авторизации `contexts/AuthContext.tsx`

### Шаг 2.3: Исправление useSyncExternalStore
- [ ] Найти все использования `useSyncExternalStore`
- [ ] Заменить на правильную реализацию с `useSyncExternalStoreWithSelector`
- [ ] Или использовать стандартные паттерны React для подписки

---

## Этап 3: Доступность (День 3)

### Шаг 3.1: ARIA-атрибуты
- [ ] Добавить `aria-label` для всех кнопок с иконками:
  ```tsx
  <button aria-label="Закрыть модальное окно">
    <XIcon />
  </button>
  ```
- [ ] Добавить `role="alert"` для сообщений об ошибках
- [ ] Использовать `aria-live="polite"` для динамического контента
- [ ] Добавить `aria-expanded` для раскрывающихся элементов

### Шаг 3.2: Skip-to-content
- [ ] Добавить компонент `components/SkipLink.tsx`:
  ```tsx
  export function SkipLink() {
    return (
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white p-4 z-50"
      >
        Перейти к основному контенту
      </a>
    )
  }
  ```
- [ ] Добавить `id="main-content"` на главный контейнер страницы
- [ ] Разместить `SkipLink` в `app/layout.tsx`

### Шаг 3.3: Контраст цветов
- [ ] Проверить контраст всех текстовых пар (минимум 4.5:1)
- [ ] Использовать инструменты: WebAIM Contrast Checker
- [ ] Обновить цвета в `tailwind.config.ts` при необходимости
- [ ] Протестировать в режиме высокой контрастности ОС

### Шаг 3.4: Label associations
- [ ] Убедиться, что все `input` имеют соответствующие `label`
- [ ] Использовать `htmlFor` и `id` для связи:
  ```tsx
  <label htmlFor="phone">Телефон</label>
  <input id="phone" type="tel" />
  ```
- [ ] Для визуально скрытых label использовать класс `sr-only`

---

## Этап 4: UX/UI улучшения (День 4-5)

### Шаг 4.1: Скелетоны вместо спиннеров
- [ ] Создать компонент `components/ui/Skeleton.tsx`:
  ```tsx
  export function Skeleton({ className }: { className?: string }) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
    )
  }
  ```
- [ ] Заменить спиннеры в загрузке данных на скелетоны
- [ ] Создать прелоадеры для карточек услуг, форм, таблиц

### Шаг 4.2: Тосты/снекбары
- [ ] Установить `npm install sonner` или `react-hot-toast`
- [ ] Настроить провайдер в `app/layout.tsx`
- [ ] Заменить `alert()` и кастомные модалки на тосты
- [ ] Создать утилиту `lib/toast.ts` с готовыми шаблонами

### Шаг 4.3: Оптимистичные обновления
- [ ] Для лайков, комментариев, статусов обновлять UI сразу
- [ ] Использовать `optimisticUpdate` в мутациях
- [ ] Обрабатывать откат при ошибке:
  ```tsx
  const mutation = useMutation({
    mutationFn: updateData,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['data'] })
      const previous = queryClient.getQueryData(['data'])
      queryClient.setQueryData(['data'], newData)
      return { previous }
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['data'], context.previous)
    }
  })
  ```

### Шаг 4.4: Пагинация и поиск в админ-панели
- [ ] Добавить пагинацию с `limit` и `startAfter` для Firestore
- [ ] Создать компонент `components/ui/Pagination.tsx`
- [ ] Реализовать поиск по имени, телефону, статусу
- [ ] Добавить фильтрацию по датам и статусам
- [ ] Показать общее количество записей

---

## Этап 5: Производительность (День 6)

### Шаг 5.1: Оптимизация изображений
- [ ] Конвертировать изображения в WebP/AVIF формат
- [ ] Использовать `next/image` с правильными размерами
- [ ] Добавить `loading="lazy"` для изображений ниже fold
- [ ] Реализовать blur placeholder для основных изображений

### Шаг 5.2: Мемоизация обработчиков
- [ ] Обернуть обработчики в `useCallback`:
  ```tsx
  const handleSubmit = useCallback(async (data) => {
    // logic
  }, [dependencies])
  ```
- [ ] Использовать `React.memo` для тяжёлых компонентов
- [ ] Профилировать с React DevTools Profiler

### Шаг 5.3: Исправление onSnapshot
- [ ] Убедиться, что все подписки отписываются:
  ```tsx
  useEffect(() => {
    const unsubscribe = onSnapshot(collection, (snapshot) => {
      // handle
    })
    return () => unsubscribe()
  }, [])
  ```
- [ ] Избегать создания новых подписок на каждый рендер

### Шаг 5.4: Code Splitting
- [ ] Разделить админ-панель в отдельный бандл
- [ ] Использовать динамические импорты:
  ```tsx
  const AdminPanel = dynamic(() => import('./admin/page'), { 
    loading: () => <Skeleton className="h-screen" />,
    ssr: false 
  })
  ```
- [ ] Настроить webpack bundle analyzer

---

## Этап 6: Тестирование (День 7-9)

### Шаг 6.1: Настройка Vitest и Testing Library
- [ ] Установить: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] Создать `vitest.config.ts`:
  ```ts
  import { defineConfig } from 'vitest/config'
  import react from '@vitejs/plugin-react'
  
  export default defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
    },
  })
  ```
- [ ] Создать `src/test/setup.ts` с глобальными моками
- [ ] Добавить скрипт `"test": "vitest"` в `package.json`

### Шаг 6.2: Unit тесты для калькулятора
- [ ] Протестировать функцию расчёта стоимости
- [ ] Протестировать валидацию входных данных
- [ ] Протестировать граничные случаи
- [ ] Достичь покрытия 80%+

### Шаг 6.3: Integration тесты для форм
- [ ] Протестировать полную отправку формы
- [ ] Протестировать валидацию полей
- [ ] Протестировать обработку ошибок
- [ ] Моковать Firebase и API вызовы

### Шаг 6.4: E2E тесты
- [ ] Установить Playwright: `npm install -D @playwright/test`
- [ ] Создать тесты для критических путей:
  - Главная → Форма заявки → Подтверждение
  - Авторизация → Админ-панель → Управление заявками
- [ ] Настроить CI для запуска тестов
- [ ] Добавить визуальные регрессионные тесты

---

## Этап 7: SEO и метаданные (День 10)

### Шаг 7.1: Динамические метаданные
- [ ] Использовать Metadata API Next.js 14+:
  ```tsx
  export async function generateMetadata({ params }): Promise<Metadata> {
    return {
      title: 'Название страницы | Строительная компания',
      description: 'Описание страницы',
      openGraph: {
        title: 'OG Title',
        description: 'OG Description',
        images: ['/og-image.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
      }
    }
  }
  ```
- [ ] Создать шаблоны для разных типов страниц
- [ ] Добавить canonical URLs

### Шаг 7.2: Sitemap и robots.txt
- [ ] Создать `app/sitemap.ts`:
  ```tsx
  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // генерация списка URL
  }
  ```
- [ ] Создать `app/robots.ts`:
  ```tsx
  export default function robots(): MetadataRoute.Robots {
    return {
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://site.com/sitemap.xml',
    }
  }
  ```

### Шаг 7.3: Structured Data (Schema.org)
- [ ] Добавить JSON-LD для организации:
  ```tsx
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Название компании',
        // остальные поля
      })
    }}
  />
  ```
- [ ] Добавить разметку для услуг, отзывов, FAQ

---

## Этап 8: Developer Experience (День 11)

### Шаг 8.1: Husky и lint-staged
- [ ] Установить: `npm install -D husky lint-staged`
- [ ] Инициализировать: `npx husky init`
- [ ] Настроить `.husky/pre-commit`:
  ```bash
  npx lint-staged
  ```
- [ ] Добавить в `package.json`:
  ```json
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
  ```

### Шаг 8.2: Commitlint
- [ ] Установить: `npm install -D @commitlint/cli @commitlint/config-conventional`
- [ ] Создать `commitlint.config.js`:
  ```js
  module.exports = { extends: ['@commitlint/config-conventional'] }
  ```
- [ ] Добавить hook: `npx husky add .husky/commit-msg 'npx commitlint --edit $1'`

### Шаг 8.3: Prettier конфигурация
- [ ] Создать `.prettierrc`:
  ```json
  {
    "semi": false,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5"
  }
  ```
- [ ] Создать `.prettierignore`

### Шаг 8.4: Алиасы импортов
- [ ] Настроить `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./src/*"],
        "@components/*": ["./src/components/*"],
        "@lib/*": ["./src/lib/*"]
      }
    }
  }
  ```
- [ ] Настроить `next.config.js` для webpack alias

---

## Этап 9: Мониторинг (День 12)

### Шаг 9.1: Sentry
- [ ] Установить: `npm install @sentry/nextjs`
- [ ] Инициализировать: `npx @sentry/wizard -i nextjs`
- [ ] Настроить sourcemaps для production
- [ ] Добавить фильтрацию чувствительных данных

### Шаг 9.2: Google Analytics 4
- [ ] Создать компонент `components/GoogleAnalytics.tsx`:
  ```tsx
  export function GoogleAnalytics({ GA_ID }: { GA_ID: string }) {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script id="gtag-init">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </>
    )
  }
  ```
- [ ] Добавить трекинг событий (отправка форм, клики)
- [ ] Настроить цели в GA4

### Шаг 9.3: Performance Monitoring
- [ ] Использовать Web Vitals от Next.js
- [ ] Отправлять метрики в аналитику:
  ```tsx
  export function reportWebVitals(metric) {
    console.log(metric)
    // отправить в аналитику
  }
  ```
- [ ] Настроить дашборды в Sentry/GA4
- [ ] Установить бюджеты производительности

---

## 📅 Сводный график

| Этап | Дни | Приоритет | Сложность |
|------|-----|-----------|-----------|
| 1. Безопасность | 1 | 🔴 Высокий | Средняя |
| 2. Архитектура | 1 | 🔴 Высокий | Высокая |
| 3. Доступность | 1 | 🟡 Средний | Низкая |
| 4. UX/UI | 2 | 🟡 Средний | Средняя |
| 5. Производительность | 1 | 🟡 Средний | Высокая |
| 6. Тестирование | 3 | 🟢 Низкий | Высокая |
| 7. SEO | 1 | 🟡 Средний | Низкая |
| 8. DevEx | 1 | 🟢 Низкий | Низкая |
| 9. Мониторинг | 1 | 🟢 Низкий | Средняя |

**Общая оценка:** 12 рабочих дней

---

## ✅ Чеклист готовности к продакшену

- [ ] Все API ключи скрыты в переменных окружения
- [ ] Валидация телефона работает корректно
- [ ] Rate limiting настроен
- [ ] Типизация TypeScript полная
- [ ] Accessibility проверена инструментами (axe, Lighthouse)
- [ ] Тесты покрывают 80%+ критического кода
- [ ] SEO метаданные настроены
- [ ] Мониторинг подключён
- [ ] CI/CD пайплайн настроен
- [ ] Документация обновлена

---

## 🛠️ Необходимые зависимости

```bash
# Безопасность
npm install libphonenumber-js rate-limiter-flexible

# Тестирование
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test

# Уведомления
npm install sonner

# Мониторинг
npm install @sentry/nextjs

# DevEx
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

---

## 📚 Дополнительные ресурсы

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Best Practices](https://firebase.google.com/docs/build)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Performance](https://web.dev/performance/)
- [Testing Library](https://testing-library.com/)
