# Step 1: Build the app
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
# === DUA BARIS PENTING YANG HILANG ADA DI SINI ===
# Terima argumen build dari perintah `docker build --build-arg`
ARG VITE_GPT_TOKEN
# Set argumen itu sebagai environment variable agar bisa dibaca Vite
ENV VITE_GPT_TOKEN=${VITE_GPT_TOKEN}
# ===============================================

# Jalankan build SETELAH environment variable di-set
RUN npm run build


# Step 2: Serve with Nginx
FROM nginx:stable-alpine

# Salin hasil build ke direktori HTML Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Opsional: config nginx untuk routing SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]