# Relax Map

Веб-застосунок для пошуку та обміну місцями відпочинку в Україні. Користувачі можуть переглядати локації, додавати власні місця, залишати відгуки та оцінки.

## Технології

- **Next.js 16** — фреймворк з App Router
- **React 19** — UI-бібліотека
- **TypeScript** — типізація
- **TanStack Query** — серверний стан та кешування
- **Zustand** — клієнтський стан
- **Formik + Yup** — форми та валідація
- **Axios** — HTTP-клієнт
- **Cloudinary** — завантаження та зберігання зображень
- **Swiper** — карусель/слайдер
- **react-hot-toast** — сповіщення

## Як запустити

1. Клонувати репозиторій:

```bash
git clone <repo-url>
cd next-project-group-02
```

2. Встановити залежності:

```bash
npm install
```

3. Створити файл `.env` в корені проєкту:

```
NEXT_PUBLIC_API_URL=https://node-project-group-02.onrender.com
```

4. Запустити dev-сервер:

```bash
npm run dev
```

Відкрити [http://localhost:3000](http://localhost:3000) у браузері.

## Структура проєкту

```
app/          — сторінки та роутинг (App Router)
components/   — React-компоненти
lib/          — API-клієнти та Zustand-стори
hooks/        — кастомні React-хуки
types/        — TypeScript-типи
utils/        — утиліти (схеми валідації)
public/       — статичні файли (зображення, іконки)
```

## Деплой

Проєкт розгортається на [Vercel](https://vercel.com). Кожен push у гілку `main` автоматично запускає деплой.

```bash
npm run build
```
