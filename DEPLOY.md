# Hướng dẫn Deploy API E-commerce

## Docker

### Chạy local với Docker
```bash
docker compose up -d
```

### UAT Environment
```bash
docker compose -f docker-compose.yml -f docker-compose.uat.yml up -d
```
- Port: **3001**
- DB: Dùng `NAME_DB_UAT` hoặc `NAME_DB` + `_uat` trong `.env`

### Production Environment
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```
- Port: **3000**

---

## GitHub Actions CI/CD

### Cấu hình Secrets (Settings → Secrets and variables → Actions)

| Secret | Mô tả | Ví dụ |
|--------|-------|-------|
| `UAT_SSH_HOST` | IP/domain VPS UAT | `uat.yourdomain.com` |
| `UAT_SSH_USER` | User SSH UAT | `deploy` |
| `UAT_SSH_PRIVATE_KEY` | Private key SSH UAT | Nội dung file `~/.ssh/id_rsa` |
| `UAT_DEPLOY_PATH` | Thư mục deploy trên VPS UAT | `/var/www/api-ecom-uat` |
| `PROD_SSH_HOST` | IP/domain VPS Production | `api.yourdomain.com` |
| `PROD_SSH_USER` | User SSH Production | `deploy` |
| `PROD_SSH_PRIVATE_KEY` | Private key SSH Production | Nội dung file `~/.ssh/id_rsa` |
| `PROD_DEPLOY_PATH` | Thư mục deploy trên VPS Production | `/var/www/api-ecom` |

### Environments (tùy chọn)
Tạo 2 environments trong GitHub: `uat` và `production` để thêm protection rules.

### Trigger Deploy
- **UAT**: Push lên nhánh `uat`
- **Production**: Push lên nhánh `main`
- **Manual**: Actions → Deploy to VPS → Run workflow → Chọn environment

### Chuẩn bị VPS
1. Cài Docker & Docker Compose
2. Clone repo (nhánh tương ứng):
   ```bash
   git clone -b uat https://github.com/your-repo/api-ecom.git /var/www/api-ecom-uat
   git clone -b main https://github.com/your-repo/api-ecom.git /var/www/api-ecom
   ```
3. Tạo file `.env` trong thư mục deploy (từ `.env.example`)
