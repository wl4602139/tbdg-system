# 🚀 DevOps 部署与运维手册

## 1. 容器化镜像构建 (Multi-Stage Dockerfile)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

---

## 2. Kubernetes 生产部署清单 (Deployment & Service)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tbea-dual-center-prototype
  namespace: nengtan
  labels:
    app: dual-center
spec:
  replicas: 3
  selector:
    matchLabels:
      app: dual-center
  template:
    metadata:
      labels:
        app: dual-center
    spec:
      containers:
        - name: web
          image: registry.tbea.com/nengtan/dual-center:v1.0.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "2000m"
              memory: "2048Mi"
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: dual-center-svc
  namespace: nengtan
spec:
  type: ClusterIP
  selector:
    app: dual-center
  ports:
    - port: 80
      targetPort: 3000
```
