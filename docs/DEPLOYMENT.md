# Deployment Guide

This guide covers deploying Learuma AI to production environments. Learuma AI is a full-stack AI chat application built with Flask (Python) backend and Next.js (React) frontend.

## Prerequisites

- Server with Python 3.8+ and Node.js 18+
- Database server (PostgreSQL recommended for production, SQLite for development)
- Web server (Nginx recommended)
- SSL certificate for HTTPS
- Domain name
- GROQ API key for AI functionality

## Environment Configuration

### Backend Environment Variables

Create a production `.env` file in the `backend/` directory based on `.env.example`:

```bash
# Database Configuration
# For production, use PostgreSQL
DATABASE_URI=postgresql://username:password@localhost:5432/learuma_ai
# For local development, SQLite is also supported
DATABASE_LOCAL=sqlite:///app.db

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here-minimum-32-characters

# AI Configuration (Required)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODELS=openai/gpt-oss-20b,openai/gpt-oss-120b

# Flask Configuration (production settings)
FLASK_ENV=production
FLASK_DEBUG=False

# Security Configuration
SECRET_KEY=your-flask-secret-key-here-minimum-32-characters

# CORS Configuration
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# ChromaDB Configuration
CHROMA_PERSIST_DIRECTORY=/var/data/chroma_db

# Optional: Ollama Models (if using Ollama instead of Groq)
OLLAMA_MODELS=gpt-oss:20b
```

### Frontend Environment Variables

Create a production `.env.local` file in the `frontend/` directory based on `.env.example`:

```bash
# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=https://api.yourdomain.com/

# Application Configuration
NEXT_PUBLIC_APP_NAME=Learuma AI
NEXT_PUBLIC_APP_VERSION=0.1.0

# Environment
NODE_ENV=production
```

## Database Setup

### PostgreSQL Installation (Recommended for Production)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib python3-psycopg2

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib python3-psycopg2
sudo postgresql-setup initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# macOS (using Homebrew)
brew install postgresql
brew services start postgresql
```

### Database Configuration

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE learuma_ai;
CREATE USER learuma_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE learuma_ai TO learuma_user;

# Grant additional permissions for modern PostgreSQL
GRANT CREATE ON SCHEMA public TO learuma_user;
GRANT USAGE ON SCHEMA public TO learuma_user;

\q
```

### Database Initialization

The application uses SQLAlchemy with automatic table creation. The database tables will be created automatically when the application starts:

```bash
cd backend
source .venv/bin/activate

# Install dependencies
pip install pip Flask flask-cors flask-jwt-extended Flask-SQLAlchemy python-dotenv chromadb ollama pypdf groq psycopg2

# The application will create tables automatically on first run
flask --app main run
```

### SQLite Setup (Development/Testing)

For development or small deployments, you can use SQLite:

```bash
# Set DATABASE_URI in .env to use SQLite
DATABASE_URI=sqlite:///learuma_ai.db
# or use the DATABASE_LOCAL variable
DATABASE_LOCAL=sqlite:///app.db
```

## Backend Deployment

### Python Environment Setup

```bash
# Create application directory
sudo mkdir -p /var/www/learuma-ai
sudo chown $USER:$USER /var/www/learuma-ai

# Clone or copy your application
cd /var/www/learuma-ai
# Copy your backend files here

# Create virtual environment
cd backend
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install pip Flask flask-cors flask-jwt-extended Flask-SQLAlchemy python-dotenv chromadb ollama pypdf groq psycopg2
pip install gunicorn psycopg2-binary  # Add production dependencies
```

### Using Gunicorn (Recommended)

Create a Gunicorn configuration file `backend/gunicorn.conf.py`:
```python
# Gunicorn configuration for Learuma AI
import multiprocessing

# Server socket
bind = "127.0.0.1:5000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Restart workers after this many requests, to help prevent memory leaks
max_requests = 1000
max_requests_jitter = 100

# Load application code before the worker processes are forked
preload_app = True

# Logging
accesslog = "/var/log/learuma-ai/access.log"
errorlog = "/var/log/learuma-ai/error.log"
loglevel = "info"

# Process naming
proc_name = "learuma-ai"

# Server mechanics
daemon = False
pidfile = "/var/run/learuma-ai.pid"
user = "www-data"
group = "www-data"
tmp_upload_dir = None
```

Create log directory:
```bash
sudo mkdir -p /var/log/learuma-ai
sudo chown www-data:www-data /var/log/learuma-ai
```

Create a systemd service file `/etc/systemd/system/learuma-api.service`:
```ini
[Unit]
Description=Learuma AI Flask API
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/learuma-ai/backend
Environment=PATH=/var/www/learuma-ai/backend/.venv/bin
EnvironmentFile=/var/www/learuma-ai/backend/.env
ExecStart=/var/www/learuma-ai/backend/.venv/bin/gunicorn -c gunicorn.conf.py main:app
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl start learuma-api
sudo systemctl enable learuma-api
sudo systemctl status learuma-api
```

## Frontend Deployment

### Node.js Environment Setup

```bash
# Install Node.js (using NodeSource repository for Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or using nvm (recommended for development)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### Build for Production

```bash
cd /var/www/learuma-ai/frontend

# Install dependencies
npm ci --only=production

# Create production build
npm run build

# Test the build locally (optional)
npm start
```

### Using PM2 (Recommended)

Install PM2:
```bash
npm install -g pm2
```

Create `frontend/ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'learuma-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/learuma-ai/frontend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/learuma-ai/frontend-error.log',
    out_file: '/var/log/learuma-ai/frontend-out.log',
    log_file: '/var/log/learuma-ai/frontend-combined.log',
    time: true
  }]
};
```

Start with PM2:
```bash
cd /var/www/learuma-ai/frontend
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Web Server Configuration

### Nginx Configuration

Create `/etc/nginx/sites-available/learuma-ai`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/learuma-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Docker Deployment

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir pip Flask flask-cors flask-jwt-extended Flask-SQLAlchemy python-dotenv chromadb ollama pypdf groq psycopg2 gunicorn psycopg2-binary

# Copy project
COPY . .

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

# Expose port
EXPOSE 5000

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "30", "main:app"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: learuma_ai
      POSTGRES_USER: learuma_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build: ./backend
    environment:
      DATABASE_URI: postgresql://learuma_user:secure_password@postgres:5432/learuma_ai
      JWT_SECRET_KEY: your-jwt-secret-key
      GROQ_API_KEY: your-groq-api-key
      FLASK_ENV: production
    depends_on:
      - postgres
    restart: unless-stopped

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_BACKEND_URL: http://backend:5000/api
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Security Considerations

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### SSL/TLS Configuration

Use Let's Encrypt for free SSL certificates:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Application Security

- Keep dependencies updated
- Use environment variables for secrets
- Validate all user inputs
- Implement proper authentication and authorization
- Regular security audits

## Monitoring and Backup

### Health Checks

Create monitoring scripts to check application health:

```bash
#!/bin/bash
# health-check.sh

API_URL="https://api.yourdomain.com/api/auth/me"
FRONTEND_URL="https://yourdomain.com"

# Check API health
if curl -f -s $API_URL > /dev/null; then
    echo "API is healthy"
else
    echo "API is down"
fi

# Check frontend health
if curl -f -s $FRONTEND_URL > /dev/null; then
    echo "Frontend is healthy"
else
    echo "Frontend is down"
fi
```

### Database Backups

Create automated backup script:
```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/var/backups/learuma-ai"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="learuma_ai"

mkdir -p $BACKUP_DIR

pg_dump $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup-db.sh
```

## Performance Optimization

### Database Optimization

- Create appropriate indexes for frequently queried fields
- Use connection pooling
- Regular database maintenance (VACUUM, ANALYZE)

### Application Optimization

- Enable gzip compression in Nginx
- Use CDN for static assets
- Implement caching strategies
- Optimize database queries

### Frontend Optimization

- Enable Next.js optimizations
- Use image optimization
- Implement lazy loading
- Minimize bundle size

## Troubleshooting

### Common Issues

1. **Database connection errors**: Check database configuration and credentials
2. **API connection issues**: Verify backend is running and accessible
3. **Build errors**: Check for TypeScript errors and dependency issues
4. **Permission errors**: Ensure proper file permissions and ownership

### Log Locations

- Backend logs: `/var/log/learuma-ai/`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u learuma-api`

### Debugging Commands

```bash
# Check service status
sudo systemctl status learuma-api
sudo systemctl status learuma-frontend

# View logs
sudo journalctl -u learuma-api -f
sudo tail -f /var/log/learuma-ai/error.log

# Test API endpoints
curl -X GET http://localhost:5000/api/auth/me
```