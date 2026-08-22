# --- ÉTAPE 1 : Compilation du build Web avec Expo ---
FROM node:20-alpine AS build_stage
WORKDIR /app

# Installation des dépendances système nécessaires pour certaines extensions Expo
RUN apk add --no-cache bash

# Copie des fichiers de configuration et dépendances
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copie de tout le code source (y compris app.json ou app.config.js)
COPY . .
# ... (votre code Dockerfile précédent jusqu'à COPY . .)

# --- AJOUTEZ CETTE LIGNE ICI ---
# RUN npx expo install react-native-web react-dom @expo/metro-runtime -- --legacy-peer-deps

# Commande officielle Expo pour exporter le projet en fichiers statiques Web
RUN npx expo export --platform web

# --- ÉTAPE 2 : Serveur de production Nginx ---
FROM nginx:alpine

# Configuration personnalisée de Nginx pour le routage de l'application
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Attention : Expo génère le build dans le dossier '/app/dist'
COPY --from=build_stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
