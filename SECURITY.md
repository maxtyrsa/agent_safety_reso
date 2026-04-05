# Руководство по безопасности

## Настройка переменных окружения

### Шаг 1: Создайте файл `.env.local`

Скопируйте файл `.env.local.example` и заполните его своими данными:

```bash
cp .env.local.example .env.local
```

### Шаг 2: Заполните переменные окружения

Отредактируйте файл `.env.local` и замените значения на ваши:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID="your-database-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"

# Admin Email
NEXT_PUBLIC_ADMIN_EMAIL="your-admin-email@example.com"
```

### Шаг 3: Удалите файл с конфиденциальными данными

Файл `firebase-applet-config.json` теперь не нужен и должен быть удалён:

```bash
rm firebase-applet-config.json
```

**Важно:** Файл `.env.local` уже добавлен в `.gitignore` и не будет закоммичен в репозиторий.

## Валидация телефона

Проект использует встроенную валидацию номеров телефонов для России и Казахстана. 
Номера автоматически форматируются в формате `+7 (XXX) XXX-XX-XX`.

## Rate Limiting (рекомендации)

Для production-окружения рекомендуется настроить rate limiting на уровне:
- Vercel/Netlify (если используете)
- Cloudflare
- Nginx/Apache

## Мониторинг

Рекомендуется подключить:
- Sentry для отслеживания ошибок
- Google Analytics 4 для аналитики
- Firebase Performance Monitoring
