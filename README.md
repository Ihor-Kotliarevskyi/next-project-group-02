# 🗺️ RelaxMap — Frontend

**Next.js застосунок для платформи пошуку місць відпочинку в Україні**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/Zustand-5-brown?style=flat-square)](https://zustand-demo.pmnd.rs)

</div>

---

## 📋 Зміст

- [Про проєкт](#-про-проєкт)
- [Технологічний стек](#-технологічний-стек)
- [Архітектура](#-архітектура)
- [Маршрутизація](#-маршрутизація)
- [Проксі-шар API](#-проксі-шар-api)
- [Встановлення](#-встановлення)
- [Змінні середовища](#-змінні-середовища)
- [Запуск](#-запуск)

---

## 🌿 Про проєкт

**RelaxMap** — це платформа для відкриття та обміну місцями відпочинку по всій Україні. Даний репозиторій містить клієнтську частину застосунку, побудовану на **Next.js 15** з використанням App Router, Server Components та паралельних маршрутів.

### Ключові можливості

- 🔐 **Автентифікація** — вхід / реєстрація з автоматичним оновленням сесії через middleware
- 📍 **Перегляд локацій** — список, пошук, фільтрація, детальна сторінка з галереєю
- ✍️ **Управління локаціями** — додавання та редагування власних місць відпочинку
- 💬 **Відгуки** — зірковий рейтинг і коментарі у вигляді модального вікна
- 👤 **Профіль** — перегляд та редагування власного облікового запису
- 🪟 **Intercepting Routes** — відгуки та підказки авторизації відкриваються як оверлей без зміни URL
- 🔄 **SSR + React Query** — дані рендеряться на сервері та гідратуються на клієнті

---

## 🛠️ Технологічний стек

| Шар | Технологія |
|-----|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + TypeScript 5 |
| Стилізація | CSS Modules + modern-normalize |
| Шрифти | Montserrat (Google Fonts) |
| Серверний стан | TanStack React Query 5 |
| Клієнтський стан | Zustand 5 (persist) |
| HTTP клієнт | Axios |
| Форми | Formik + Yup |
| Зображення | Cloudinary |
| Слайдер | Swiper |
| Рейтинг | react-rating-stars-component |
| Сповіщення | react-hot-toast |
| Спінери | react-spinners |
| Лінтер | ESLint (eslint-config-next) |

---

## 🏗️ Архітектура

```
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Кореневий layout (TanStackProvider, AuthProvider, Toaster)
│   ├── loading.tsx               # Глобальний стан завантаження
│   ├── not-found.tsx             # Сторінка 404
│   ├── globals.css               # Глобальні стилі
│   │
│   ├── (auth routes)/            # Route group — сторінки автентифікації
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (main)/                   # Route group — основний layout з Header/Footer
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Головна сторінка
│   │   ├── locations/
│   │   │   ├── page.tsx          # Список локацій
│   │   │   └── [locationId]/page.tsx  # Деталі локації
│   │   ├── profile/[userId]/page.tsx  # Публічний профіль
│   │   └── (private routes)/    # Захищені сторінки (потребують авторизації)
│   │       ├── profile/
│   │       │   ├── page.tsx      # Власний профіль
│   │       │   └── edit/page.tsx
│   │       └── locations/
│   │           ├── add/page.tsx
│   │           └── [locationId]/edit/page.tsx
│   │
│   ├── @modal/                   # Паралельний слот для модальних вікон
│   │   ├── default.tsx
│   │   ├── loading.tsx
│   │   ├── [...catchAll]/page.tsx
│   │   ├── (.)add-review/        # Intercepting route — форма відгуку
│   │   │   ├── page.tsx
│   │   │   ├── AddReviewForm.tsx
│   │   │   └── AddReviewForm.module.css
│   │   ├── (.)auth-prompt/page.tsx   # Intercepting route — запит авторизації
│   │   └── (.)logout-confirm/page.tsx # Intercepting route — підтвердження виходу
│   │
│   ├── add-review/page.tsx       # Повна сторінка відгуку (fallback)
│   ├── auth-prompt/page.tsx
│   ├── logout-confirm/page.tsx
│   │
│   └── api/                      # Next.js Route Handlers (проксі до бекенду)
│       ├── api.ts                # Axios-інстанс для серверних запитів
│       ├── _utils/utils.ts
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   ├── register/route.ts
│       │   └── session/route.ts
│       ├── locations/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       └── feedbacks/route.ts
│       ├── categories/
│       │   ├── regions/route.ts
│       │   └── types/route.ts
│       └── users/me/route.ts
│
├── components/                   # UI-компоненти
│   ├── Header / Footer
│   ├── AuthComponent/            # AuthNav, LoginForm, RegistrationForm
│   ├── AuthProvider/             # Контекст авторизації
│   ├── TanStackProvider/         # React Query провайдер
│   ├── Modal/                    # Базовий компонент модального вікна
│   ├── AddReviewModal/
│   ├── AuthPromptModal/
│   ├── ConfirmationModal/
│   ├── LocationCard / LocationList / LocationForm
│   ├── ProfileLocationList
│   ├── FeedBackCard
│   ├── ReviewsBlock / ReviewsSection
│   ├── SearchBox
│   ├── Pagination
│   ├── HeroBlock / AdvantagesBlock / PopularLocationsBlock
│   ├── Home
│   └── Logo
│
├── lib/                          # Бізнес-логіка та стан
│   ├── api/
│   │   ├── api.ts                # Базовий Axios-інстанс
│   │   ├── clientApi.ts          # Клієнтські API-функції
│   │   ├── serverApi.ts          # Серверні API-функції (для SSR)
│   │   └── feedbacks.ts
│   ├── store/
│   │   ├── authStore.ts          # Zustand — стан авторизації (persist)
│   │   ├── locationStore.ts      # Zustand — стан локацій
│   │   └── feedbackStore.ts      # Zustand — стан відгуків
│   └── validation/
│       └── locationSchema.ts     # Yup-схема для форми локації
│
├── hooks/
│   └── useAuth.ts                # Хук авторизації
│
├── types/                        # TypeScript-типи
│   ├── user.ts
│   ├── location.ts
│   ├── locationTypes.ts
│   ├── region.ts
│   └── feedBackCard.ts
│
├── utils/
│   ├── labels.ts                 # Допоміжні мітки / константи
│   ├── uploadImage.ts            # Завантаження зображень на Cloudinary
│   └── validationSchemas.ts
│
├── public/                       # Статичні файли
├── proxy.ts                      # Middleware: захист маршрутів + refresh токена
├── next.config.ts
└── tsconfig.json
```

---

## 🗂️ Маршрутизація

### Публічні сторінки

| Шлях | Опис |
|------|------|
| `/` | Головна сторінка |
| `/locations` | Каталог локацій |
| `/locations/[locationId]` | Деталі локації |
| `/profile/[userId]` | Публічний профіль користувача |
| `/login` | Сторінка входу |
| `/register` | Сторінка реєстрації |

### Захищені сторінки (потребують авторизації)

| Шлях | Опис |
|------|------|
| `/profile` | Власний профіль |
| `/profile/edit` | Редагування профілю |
| `/locations/add` | Додавання локації |
| `/locations/[id]/edit` | Редагування локації |

### Модальні вікна (Intercepting Routes)

| Шлях | Опис |
|------|------|
| `/add-review` | Форма відгуку (відкривається як оверлей) |
| `/auth-prompt` | Запит авторизації (оверлей) |
| `/logout-confirm` | Підтвердження виходу (оверлей) |

---

## 🔀 Проксі-шар API

Фронтенд **не звертається до бекенду напряму**. Усі запити проходять через Next.js **Route Handlers** (`/app/api/...`), які:

1. Приймають запит від клієнта
2. Прикріплюють cookie сесії (для захищених ендпоінтів)
3. Пересилають запит на Express-бекенд
4. Повертають відповідь клієнту

```
Браузер → /api/locations → Route Handler → Express API
```

Логіка захисту маршрутів і оновлення токенів реалізована у `proxy.ts` (Next.js Middleware):
- Якщо `accessToken` відсутній, але є `refreshToken` — автоматично оновлює сесію
- Неавторизованих користувачів перенаправляє з приватних сторінок на `/login`
- Авторизованих перенаправляє зі сторінок `/login` та `/register` на головну

---

## 🚀 Встановлення

### Вимоги

- Node.js `v18+`
- Запущений [RelaxMap Backend](https://github.com/Ihor-Kotliarevskyi/node-project-group-02)

### Кроки

```bash
# 1. Клонувати репозиторій
git clone https://github.com/Ihor-Kotliarevskyi/next-project-group-02.git
cd next-project-group-02

# 2. Встановити залежності
npm install

# 3. Створити файл .env.local
cp .env.example .env.local
# Заповнити значення (див. нижче)
```

---

## ⚙️ Змінні середовища

Створіть файл `.env.local` у корені проєкту:

```env
# URL бекенд-сервера (Express API)
BACKEND_API_URL=http://localhost:5000

# Cloudinary (для завантаження зображень)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## ▶️ Запуск

```bash
# Режим розробки
npm run dev
# Застосунок буде доступний на http://localhost:3000

# Збірка для продакшну
npm run build

# Запуск продакшн-збірки
npm start

# Перевірка лінтером
npm run lint
```

---

Розроблено командою **Group 02** · [GitHub](https://github.com/Ihor-Kotliarevskyi/next-project-group-02)
