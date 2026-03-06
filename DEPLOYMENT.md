# Deployment Guide

## Backend Deployment

### Using Docker

1. **Build the image:**
```bash
cd backend
docker build -t vazhikaatti-backend .
```

2. **Run the container:**
```bash
docker run -p 8000:8000 vazhikaatti-backend
```

### Using Heroku

```bash
heroku create vazhikaatti-backend
git push heroku main
heroku config:set DATABASE_URL=your_database_url
```

### Using AWS EC2

1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install dependencies:
```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx
```

4. Clone repository and setup:
```bash
git clone https://github.com/ManujanaNagaraj/VazhiKaatti-AI-Credit-Companion-for-Women-Farmers.git
cd VazhiKaatti-AI-Credit-Companion-for-Women-Farmers/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

5. Configure Nginx as reverse proxy
6. Setup SSL with Let's Encrypt

## Frontend Deployment

### Using Vercel

```bash
cd frontend
vercel
```

### Using Netlify

```bash
npm run build
netlify deploy --prod --dir=build
```

### Using GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to package.json:
```json
"homepage": "https://yourusername.github.io/vazhikaatti",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Deploy:
```bash
npm run deploy
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost/vazhikaatti
SECRET_KEY=your-secret-key
AADHAAR_API_KEY=your-aadhaar-api-key
```

### Frontend (.env)
```
REACT_APP_API_URL=https://api.vazhikaatti.in
```

## Database Setup

### PostgreSQL

```bash
createdb vazhikaatti
psql vazhikaatti < schema.sql
```

## Monitoring

- Use PM2 for process management
- Setup logging with ELK stack
- Monitor with Grafana

## Security Checklist

- [ ] Enable HTTPS
- [ ] Setup CORS properly
- [ ] Use environment variables
- [ ] Enable rate limiting
- [ ] Setup database backups
- [ ] Configure firewall
- [ ] Regular security updates

## Scaling

- Use load balancer (Nginx/HAProxy)
- Setup database replication
- Use Redis for caching
- CDN for static assets
