# Production Setup Guide for Dividend Tracker

This guide outlines the steps to deploy the ETF Dividend Tracker application on a Hostinger VPS with Docker, Docker Compose, and Appwrite.

## Prerequisites

- Hostinger VPS with Docker, Docker Compose, and Appwrite pre-installed
- Domain name pointing to your VPS
- Mailgun account for SMTP services
- Polygon.io API key

## Step 1: Clone the Repository

```bash
# Connect to your VPS via SSH
ssh user@your-vps-ip

# Create a directory for the application
mkdir -p /var/www/etf-tracker
cd /var/www/etf-tracker

# Clone the repository
git clone https://your-repository-url.git .
```

## Step 2: Configure Environment Variables

1. Create a `.env` file for Docker Compose:

```bash
# Create .env file for Docker Compose
cp .env.example .env
```

2. Edit the `.env` file with your production values:

```
# Mailgun SMTP credentials
MAILGUN_USERNAME=your-mailgun-username
MAILGUN_PASSWORD=your-mailgun-password

# Domain settings
DOMAIN=your-domain.com
EMAIL=your-email@example.com
```

3. Update the `.env.production` file with your specific configuration:

```bash
# Edit the production environment file
nano .env.production
```

## Step 3: Configure Appwrite

1. Update the Appwrite configuration in `docker-compose.yml`:

```bash
# Edit docker-compose.yml
nano docker-compose.yml
```

2. Replace placeholder values:
   - `_APP_DOMAIN`: Your domain name
   - `_APP_OPENSSL_KEY_V1`: Generate a secure key
   - `_APP_SYSTEM_EMAIL_ADDRESS`: Your system email
   - Database credentials (keep secure in production)

## Step 4: Configure Traefik for HTTPS

1. Update the Traefik configuration:

```bash
# Create the traefik directory if it doesn't exist
mkdir -p traefik

# Edit the Traefik configuration
nano traefik/traefik.yml
nano traefik/dynamic_conf.yml
```

2. Replace placeholder values:
   - `your-email@example.com` with your actual email
   - `your-domain.com` with your actual domain

## Step 5: Update Nginx Configuration

1. Edit the Nginx configuration to match your domain and security requirements:

```bash
# Edit the Nginx configuration
nano nginx.conf
```

2. Update the Content-Security-Policy header with your actual domains.

## Step 6: Deploy with Docker Compose

```bash
# Build and start the containers
docker-compose up -d

# Check if all containers are running
docker-compose ps
```

## Step 7: Set Up Appwrite Collections and Authentication

1. Access the Appwrite Console at `https://appwrite.your-domain.com`

2. Create a new project:
   - Name: ETF Dividend Tracker
   - Set the platform to Web
   - Add your domain as an allowed domain

3. Create a database and collections:
   - ETFs Collection
   - Portfolios Collection
   - Transactions Collection
   - Dividends Collection

4. Set up email authentication:
   - Go to Auth → Settings
   - Enable Email/Password method
   - Configure email templates

5. Set up Mailgun integration:
   - Ensure SMTP settings are correctly configured in docker-compose.yml
   - Test email delivery

## Step 8: Configure Polygon API Integration

1. Update the Polygon API key in your `.env.production` file
2. Ensure WebSocket connections are properly configured in the CSP headers

## Step 9: Security Checks

1. Verify SSL/TLS is working correctly:
```bash
curl -I https://your-domain.com
```

2. Check security headers:
```bash
curl -I https://your-domain.com | grep -i "content-security-policy\|x-frame-options\|x-xss-protection"
```

3. Test Appwrite authentication flow

## Step 10: Monitoring and Maintenance

1. Set up regular backups of Appwrite data:
```bash
# Create a backup script
mkdir -p /var/backups/etf-tracker
nano /usr/local/bin/backup-appwrite.sh
```

2. Add the following content to the backup script:
```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/var/backups/etf-tracker"
docker-compose exec -T mariadb mysqldump -u appwrite -pappwrite-password appwrite > "$BACKUP_DIR/appwrite-$DATE.sql"
```

3. Make the script executable and add to crontab:
```bash
chmod +x /usr/local/bin/backup-appwrite.sh
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-appwrite.sh
```

## Troubleshooting

- **Container fails to start**: Check logs with `docker-compose logs [service_name]`
- **Appwrite connection issues**: Verify network settings and firewall rules
- **SSL certificate problems**: Check Traefik logs and certificate status

## Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Polygon.io API Documentation](https://polygon.io/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)