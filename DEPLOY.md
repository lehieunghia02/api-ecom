# Hướng dẫn Deploy API E-commerce (Docker Hub)

## Kiến trúc Deploy

```
GitHub Actions:
  1. Build Docker image
  2. Push lên Docker Hub
  3. SSH vào VPS, pull image và chạy
```

---

## Docker Hub

### Tạo Access Token
1. Đăng nhập [hub.docker.com](https://hub.docker.com)
2. Account Settings → Security → New Access Token
3. Tạo token với quyền **Read, Write, Delete**
4. Copy token (chỉ hiện 1 lần)

---

## GitHub Secrets

Vào **Settings → Secrets and variables → Actions**, tạo:

### Docker Hub
| Secret | Mô tả |
|--------|-------|
| `DOCKERHUB_USERNAME` | Username Docker Hub |
| `DOCKERHUB_TOKEN` | Access Token Docker Hub |

### UAT VPS
| Secret | Mô tả | Ví dụ |
|--------|-------|-------|
| `UAT_SSH_HOST` | IP/domain VPS | `103.75.184.146` |
| `UAT_SSH_USER` | User SSH | `root` |
| `UAT_SSH_PRIVATE_KEY` | Private key SSH | Nội dung `~/.ssh/id_rsa` |
| `UAT_SSH_PORT` | Port SSH | `24700` |
| `UAT_DEPLOY_PATH` | Thư mục chứa docker-compose | `/var/www/api-ecom-uat` |

### Production VPS
| Secret | Mô tả | Ví dụ |
|--------|-------|-------|
| `PROD_SSH_HOST` | IP/domain VPS | `api.yourdomain.com` |
| `PROD_SSH_USER` | User SSH | `root` |
| `PROD_SSH_PRIVATE_KEY` | Private key SSH | Nội dung `~/.ssh/id_rsa` |
| `PROD_SSH_PORT` | Port SSH | `24700` |
| `PROD_DEPLOY_PATH` | Thư mục chứa docker-compose | `/var/www/api-ecom` |

---

## Chuẩn bị VPS

### 1. Cài Docker
```bash
curl -fsSL https://get.docker.com | sh
```

### 2. Tạo thư mục deploy
```bash
# UAT
mkdir -p /var/www/api-ecom-uat
cd /var/www/api-ecom-uat

# Production
mkdir -p /var/www/api-ecom
cd /var/www/api-ecom
```

### 3. Tạo file cần thiết trên VPS

**UAT** (`/var/www/api-ecom-uat/`):
- `docker-compose.uat.yml` (copy từ repo)
- `.env` (tạo từ `.env.example`)

**Production** (`/var/www/api-ecom/`):
- `docker-compose.prod.yml` (copy từ repo)
- `.env` (tạo từ `.env.example`)

### 4. Tạo file .env
```bash
cat > .env << 'EOF'
# Docker Hub
DOCKERHUB_USERNAME=your_dockerhub_username

# Database
USERNAME_DB=admin
PASSWORD_DB=your_password
HOST_DB=your_mongodb_host
PORT_DB=27017
NAME_DB=ecommerce
AUTH_SOURCE=admin

# JWT
SECRET_KEY_JWT=your_secret_key

# (Chỉ UAT)
HOST_DB_UAT=
NAME_DB_UAT=ecommerce_uat

# Host
PRODUCTION_HOST=https://api.yourdomain.com
UAT_HOST=https://uat-api.yourdomain.com
EOF
```

---

## Trigger Deploy

| Môi trường | Trigger |
|------------|---------|
| UAT | Push lên nhánh `uat` |
| Production | Push lên nhánh `main` |
| Manual | Actions → Run workflow → Chọn environment |

---

## Chạy thủ công trên VPS

```bash
# UAT
cd /var/www/api-ecom-uat
docker pull your_username/api-ecom:uat
docker compose -f docker-compose.uat.yml up -d

# Production
cd /var/www/api-ecom
docker pull your_username/api-ecom:production
docker compose -f docker-compose.prod.yml up -d
```

---

## Kiểm tra

```bash
# Xem container
docker ps

# Xem logs
docker logs api-ecom-uat -f
docker logs api-ecom-production -f

# Health check
curl http://localhost:3001/api/health  # UAT
curl http://localhost:3000/api/health  # Production
```

---

## Docker Images trên Docker Hub

| Tag | Môi trường | Mô tả |
|-----|------------|-------|
| `uat` | UAT | Build từ nhánh `uat` |
| `production` | Production | Build từ nhánh `main` |
| `latest` | Production | Alias của `production` |
| `<commit-sha>` | - | Image theo commit cụ thể |
