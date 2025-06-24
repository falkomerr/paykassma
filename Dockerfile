# Этап сборки (build stage)
FROM node:20-alpine AS build

# Установка pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Установка рабочей директории
WORKDIR /app

# Копирование файлов package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Установка зависимостей
RUN pnpm install --frozen-lockfile

# Копирование всех файлов проекта
COPY . .

# Сборка приложения
RUN pnpm build

# Этап продакшена (production stage)
FROM node:20-alpine

# Создание рабочей директории
WORKDIR /app

# Установка serve для обслуживания статических файлов
RUN npm install -g serve

# Копирование собранных файлов из этапа сборки
COPY --from=build /app/dist /app

# Открытие порта 3000
EXPOSE 3000

# Запуск приложения
CMD ["serve", "-s", ".", "-l", "3000"] 