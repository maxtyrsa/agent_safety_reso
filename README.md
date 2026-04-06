<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Studio App

Next.js приложение с интеграцией Gemini API и Firebase, созданное в Google AI Studio.

[Посмотреть приложение в AI Studio](https://ai.studio/apps/7933c141-db65-44c3-945d-cdc487d8de66)

## 🚀 Возможности

- Интеграция с **Gemini API** для работы с ИИ-моделями
- **Firebase** для бэкенд-инфраструктуры (Firestore, Authentication)
- Современный стек на **Next.js** с TypeScript
- Адаптивный UI с использованием Tailwind CSS
- Модульная архитектура компонентов

## 📋 Требования

- Node.js 18+ 
- npm или yarn
- Gemini API ключ
- Firebase проект (опционально)

## 🔧 Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта и добавьте ваш Gemini API ключ:

```env
GEMINI_API_KEY=ваш_api_ключ
```

При необходимости добавьте другие переменные окружения для Firebase.

### 3. Запуск приложения

```bash
# Режим разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm start
```

Приложение будет доступно по адресу `http://localhost:3000`

## 📁 Структура проекта

```
├── app/                    # Next.js App Router
├── components/             # React компоненты
├── hooks/                  # Кастомные React хуки
├── lib/                    # Утилиты и вспомогательные функции
├── .env.local              # Переменные окружения (не коммитить)
├── firebase.json           # Конфигурация Firebase
└── package.json            # Зависимости проекта
```

## 🔐 Безопасность

- Никогда не коммитьте файл `.env.local` с API ключами
- Проверьте настройки Firestore rules перед деплоем
- Ознакомьтесь с [SECURITY.md](SECURITY.md) для деталей

## 📄 Лицензия

Условия использования определяются Google AI Studio.

## 🤝 Вклад

Этот проект создан в AI Studio. Для внесения изменений используйте AI Studio или редактируйте код локально.
