# 🔧 GitHub Configuration Guide

Complete guide to set up your GitHub repository and configure automatic deployment for the Persian Accounting System.

## 📝 Step 1: Create GitHub Repository

### 1.1 Repository Creation
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Fill in repository details:
   ```
   Repository name: comprehensive-accounting-system
   Description: Modern Persian Accounting System for Small Businesses
   Visibility: Public (recommended) or Private
   
   ❌ Do NOT initialize with:
   - README
   - .gitignore  
   - License
   ```
4. Click **"Create repository"**

### 1.2 Repository Settings
Navigate to **Settings** tab and configure:

#### General Settings:
```yaml
Features:
✅ Issues
✅ Wiki  
✅ Discussions
✅ Projects
✅ Actions

Pull Requests:
✅ Allow merge commits
✅ Allow squash merging
✅ Allow rebase merging
✅ Always suggest updating pull request branches
✅ Automatically delete head branches
```

#### Topics (Repository tags):
```
accounting, persian, business, react, nodejs, typescript, 
small-business, financial-management, rtl, farsi
```

## 🔑 Step 2: Configure Repository Secrets

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 2.1 Docker Hub Secrets
```yaml
Name: DOCKER_USERNAME
Value: your-dockerhub-username

Name: DOCKER_PASSWORD  
Value: your-dockerhub-access-token
```

### 2.2 Server Deployment Secrets
```yaml
Name: SERVER_HOST
Value: your-server-ip-or-domain

Name: SERVER_USER
Value: deploy

Name: SERVER_SSH_KEY
Value: |
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAA...
  your-complete-private-ssh-key-content
  -----END OPENSSH PRIVATE KEY-----
```

### 2.3 Application Secrets
```yaml
Name: JWT_SECRET
Value: your-super-secure-jwt-secret-at-least-256-bits

Name: DB_PASSWORD
Value: your-production-database-password

Name: REDIS_PASSWORD
Value: your-production-redis-password
```

## 🐳 Step 3: Docker Hub Setup

### 3.1 Create Docker Hub Account
1. Visit [hub.docker.com](https://hub.docker.com)
2. Sign up or sign in
3. Create new repositories:
   - Repository name: `accounting-backend`
   - Repository name: `accounting-frontend`
   - Visibility: Public (recommended for easier deployment)

### 3.2 Generate Access Token
1. Docker Hub → **Account Settings** → **Security**
2. Click **"New Access Token"**
3. Access token description: `github-actions-deploy`
4. Access permissions: **Read, Write, Delete**
5. **Copy the token** (this becomes your `DOCKER_PASSWORD` secret)

## 🔐 Step 4: SSH Key Configuration

### 4.1 Generate SSH Key Pair
On your local machine:
```bash
# Generate SSH key for GitHub Actions
ssh-keygen -t rsa -b 4096 -C "github-actions@yourdomain.com"

# When prompted:
# File: ~/.ssh/github_deploy_key
# Passphrase: (leave empty)
```

### 4.2 Copy Public Key to Server
```bash
# Copy public key to your server
ssh-copy-id -i ~/.ssh/github_deploy_key.pub deploy@your-server-ip

# Or manually:
cat ~/.ssh/github_deploy_key.pub
# Copy output and add to server's ~/.ssh/authorized_keys
```

### 4.3 Add Private Key to GitHub Secrets
```bash
# Display private key
cat ~/.ssh/github_deploy_key

# Copy the ENTIRE output (including header/footer) 
# and paste as SERVER_SSH_KEY secret in GitHub
```

### 4.4 Test SSH Connection
```bash
ssh -i ~/.ssh/github_deploy_key deploy@your-server-ip
```

## 🌐 Step 5: Domain & Environment Configuration

### 5.1 Update Environment Variables
Edit these files in your repository:

**backend/.env.production:**
```bash
NODE_ENV=production
DATABASE_URL="postgresql://accounting_user:secure_password@postgres:5432/accounting_db"
JWT_SECRET="your-production-jwt-secret"
FRONTEND_URL="https://yourdomain.com"
REDIS_URL="redis://:redis_password@redis:6379"
```

**Frontend Environment (in CI/CD):**
```bash
VITE_API_URL="https://yourdomain.com/api"
VITE_APP_NAME="سیستم حسابداری جامع"
```

### 5.2 Domain Configuration
```yaml
GitHub Repository Settings → Pages:
Source: Deploy from a branch
Branch: main
Folder: /docs (if you want documentation hosting)
Custom domain: yourdomain.com
```

## 🔄 Step 6: Branch Protection Rules

**Settings** → **Branches** → **Add rule**

### Main Branch Protection:
```yaml
Branch name pattern: main

Branch protection rules:
✅ Require a pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale reviews when new commits are pushed
  ✅ Require review from code owners

✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  Required status checks:
  - test (ubuntu-latest, 18.x)
  - test (ubuntu-latest, 20.x)
  - security

✅ Require conversation resolution before merging
✅ Include administrators
```

## 📊 Step 7: GitHub Actions Configuration

### 7.1 Enable GitHub Actions
**Settings** → **Actions** → **General**

```yaml
Actions permissions:
◉ Allow all actions and reusable workflows

Workflow permissions:
◉ Read and write permissions
✅ Allow GitHub Actions to create and approve pull requests
```

### 7.2 Environment Protection Rules
**Settings** → **Environments** → **New environment**

```yaml
Environment name: production

Protection rules:
✅ Required reviewers: [your-username]
✅ Wait timer: 0 minutes
Environment secrets: (same as repository secrets)
```

## 🚀 Step 8: Initial Repository Setup

### 8.1 Connect Local Repository
```bash
cd "e:\#my project\1111"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/comprehensive-accounting-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 8.2 Verify CI/CD Pipeline
1. After first push, go to **Actions** tab
2. You should see "CI/CD Pipeline" workflow running
3. Check all jobs pass: test, security, deploy (if pushing to main)

## 🎯 Step 9: Post-Setup Verification

### 9.1 Test Workflow
Create a test commit:
```bash
echo "# Test" >> README.md
git add .
git commit -m "Test CI/CD pipeline"
git push
```

### 9.2 Monitor Deployment
1. Check **Actions** tab for workflow status
2. If deploying to server, verify:
   ```bash
   # SSH to your server
   ssh deploy@your-server-ip
   
   # Check application status
   cd /opt/comprehensive-accounting-system
   docker-compose ps
   ```

## 📋 Step 10: Repository Maintenance

### 10.1 Enable Dependabot
Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
    
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
      
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "monthly"
```

### 10.2 Issue Templates
Create `.github/ISSUE_TEMPLATE/`:
- `bug_report.md`
- `feature_request.md`
- `support_request.md`

### 10.3 Pull Request Template
Create `.github/pull_request_template.md`:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests for new features

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🔍 Troubleshooting

### Common Issues:

**1. SSH Connection Fails:**
```bash
# Test SSH key
ssh -i ~/.ssh/github_deploy_key -T git@github.com
ssh -i ~/.ssh/github_deploy_key deploy@your-server-ip
```

**2. Docker Push Fails:**
- Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
- Check Docker Hub repository exists and is accessible

**3. Deployment Fails:**
- Check server is accessible
- Verify Docker and Docker Compose are installed on server
- Check server has enough disk space and memory

**4. Build Fails:**
- Check Node.js version compatibility
- Verify all dependencies are properly declared
- Check environment variables are correctly set

## 📞 Support

For GitHub-specific issues:
- [GitHub Docs](https://docs.github.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)

For application-specific issues:
- Check repository Issues tab
- Review application logs
- Consult DEPLOYMENT.md guide

---

**Setup completed! Your Persian Accounting System is ready for professional deployment! 🚀**