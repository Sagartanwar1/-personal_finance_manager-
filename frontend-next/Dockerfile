FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json first; if package-lock.json exists, npm ci would be ideal,
# but fall back to npm install to avoid build failure when lockfile is missing.
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/ ./
EXPOSE 3000
CMD ["npm", "run", "start"]