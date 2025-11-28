# Deployment Guide

## Quick Deploy to Vercel

Vercel is the easiest option for Next.js apps.

### Steps:

1. **Push to GitHub**
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Set Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `JWT_SECRET` = (generate a random string)

4. **Deploy**
   - Vercel automatically deploys on every push to main

### Custom Domain
- In Vercel dashboard → Settings → Domains
- Add your custom domain
- Follow DNS instructions

---

## Docker Deployment

### Create Dockerfile

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

### Build and Run

\`\`\`bash
docker build -t scalable-web-app .
docker run -p 3000:3000 -e JWT_SECRET=your-secret scalable-web-app
\`\`\`

### Docker Compose

\`\`\`yaml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      JWT_SECRET: your-secret-key
      NODE_ENV: production
\`\`\`

Run with: `docker-compose up`

---

## AWS Deployment

### Using Elastic Beanstalk

1. **Install EB CLI**
\`\`\`bash
pip install awsebcli
\`\`\`

2. **Initialize**
\`\`\`bash
eb init -p node.js-18 scalable-web-app
\`\`\`

3. **Create Environment**
\`\`\`bash
eb create scalable-web-app-env
\`\`\`

4. **Deploy**
\`\`\`bash
eb deploy
\`\`\`

### Using ECS + RDS

For production with database:

1. Create RDS PostgreSQL instance
2. Push Docker image to ECR
3. Create ECS cluster and service
4. Configure load balancer
5. Setup auto-scaling

See AWS documentation for detailed steps.

---

## Production Checklist

- [ ] JWT_SECRET set to strong random key
- [ ] NODE_ENV set to "production"
- [ ] HTTPS enabled
- [ ] CORS configured for allowed domains
- [ ] Error monitoring setup (Sentry)
- [ ] Performance monitoring enabled
- [ ] Backup strategy in place
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] WAF enabled

---

## Performance Tips

1. **Enable Compression**
   - Gzip compression for responses
   - Usually handled by platform (Vercel/AWS)

2. **Caching**
   - Browser caching for static assets
   - Set Cache-Control headers

3. **Database Optimization**
   - Add indexes on frequently queried columns
   - Use connection pooling

4. **Monitoring**
   - Setup alerts for errors
   - Monitor response times
   - Track resource usage

---

## Scaling from Demo to Production

### Current State
- In-memory database
- Single server
- No caching

### Production Requirements

1. **Database**
   - Replace with PostgreSQL
   - Use connection pooling
   - Implement backups

2. **Caching**
   - Add Redis layer
   - Cache frequently accessed data

3. **Infrastructure**
   - Multiple server instances
   - Load balancer
   - CDN for static assets

4. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Log aggregation

5. **Security**
   - Rate limiting per IP/user
   - DDoS protection
   - WAF rules

See SCALABILITY_GUIDE.md for comprehensive roadmap.
