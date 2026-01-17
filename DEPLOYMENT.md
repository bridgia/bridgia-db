# Bridgia Website - Deployment Guide

## Admin Dashboard Credentials

**URL:** `https://your-domain.com/admin`

**Username:** `bd@bridgia-sa.com`
**Password:** `bd@@bridgia@Hfkhha`

---

## Deployment on Railway

### Step 1: Connect GitHub Repository

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Select "Deploy from GitHub"
4. Connect your GitHub repository (bridgia-web)

### Step 2: Add Environment Variables

In Railway Project Settings → Variables, add:

```
DATABASE_URL=mysql://user:password@host:port/dbname
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=bd@bridgia-sa.com
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
```

### Step 3: Configure Build and Start Commands

**Build Command:**
```bash
pnpm install && pnpm db:push && pnpm build
```

**Start Command:**
```bash
node dist/index.js
```

### Step 4: Initialize Admin Password

After deployment, run this command in Railway terminal:

```bash
node -e "import('./dist/index.js').then(() => process.exit(0))"
```

Or manually set the admin password through the admin dashboard on first login.

---

## Contact Form Features

- ✅ All messages saved to database
- ✅ Automatic email notifications to: `bd@bridgia-sa.com`
- ✅ Password-protected admin dashboard
- ✅ View all submissions with timestamps
- ✅ Search and filter capabilities

---

## Database Schema

Tables automatically created:
- `users` - OAuth users
- `contact_submissions` - Contact form messages
- `admin_credentials` - Admin password (hashed with bcryptjs)

---

## Support

For issues or questions, contact: bd@bridgia-sa.com
