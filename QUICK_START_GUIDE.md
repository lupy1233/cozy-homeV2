# 🚀 Quick Start Guide - Romanian Furniture RFQ Marketplace

## 📝 Overview

This is a dual-portal furniture marketplace system:

- **Client Portal** (`/`) - Homeowners create RFQs for furniture
- **Firm Portal** (`/firm`) - Furniture companies respond to RFQs

## ⚡ Quick Setup (5 minutes)

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)

### 2. Clone & Install

```bash
git clone [your-repo-url]
cd cozy-home
npm install
```

### 3. Environment Setup

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get these values from: Supabase Dashboard → Settings → API

### 4. Database Setup

1. Go to Supabase Dashboard → SQL Editor
2. Run scripts in order:
   - `supabase/01-complete-database-setup.sql`
   - `supabase/02-verify-setup.sql` (check results)
   - `supabase/03-sample-data.sql` (optional test data)

### 5. Start Development

```bash
npm run dev
```

Visit http://localhost:3000

## 🧪 Test Credentials

### Firm Portal (`/firm/login`)

After running sample data script:

| Email                        | Password | Role     | Company              |
| ---------------------------- | -------- | -------- | -------------------- |
| ceo@mobilabucuresti.ro       | test123  | CEO      | Mobila Bucuresti SRL |
| angajat1@mobilabucuresti.ro  | test123  | Employee | Mobila Bucuresti SRL |
| director@transilvaniawood.ro | test123  | CEO      | Transilvania Wood SA |

### Client Portal

Create via Supabase Auth or use:

- Email: client@test.ro
- Password: test123

## 📁 Project Structure

```
cozy-home/
├── src/
│   ├── app/
│   │   ├── (client)/        # Client portal pages
│   │   ├── firm/            # Firm portal pages
│   │   └── api/             # API routes
│   ├── components/
│   │   ├── client/          # Client portal components
│   │   └── firm/            # Firm portal components
│   └── lib/                 # Utilities & configs
├── supabase/                # Database scripts
└── public/                  # Static assets
```

## 🔑 Key Features

### Client Portal

- User registration/login (Supabase Auth)
- Create & manage homes
- Submit RFQs with categories
- View offers from manufacturers

### Firm Portal

- Custom authentication (bcrypt + sessions)
- Role-based access (CEO vs Employee)
- RFQ marketplace with filters
- Assignment system
- Response tracking

## 🛠️ Common Tasks

### Add New RFQ (Client)

1. Login to client portal
2. Add a home (if needed)
3. Click "Create RFQ"
4. Fill form & submit

### View RFQs (Firm)

1. Login to firm portal
2. Dashboard shows available RFQs
3. Use filters to narrow results
4. Click "Răspunde" to respond

### Check Database

```sql
-- Active RFQs count
SELECT COUNT(*) FROM rfqs WHERE status = 'active';

-- Firm assignments
SELECT * FROM rfq_assignments ORDER BY assigned_at DESC;
```

## 🐛 Troubleshooting

### "supabaseUrl is required"

→ Check `.env.local` exists with all 3 variables

### Can't login to firm portal

→ Ensure you ran the sample data script
→ Check password is 'test123'

### No RFQs showing

→ Create RFQs via client portal first
→ Or uncomment RFQ inserts in sample data script

## 📚 Documentation

- [Database Setup Guide](./supabase/DATABASE_SETUP_README.md)
- [Firm System README](./FIRM_SYSTEM_README.md)
- [Supabase Docs](https://supabase.com/docs)

## 🆘 Need Help?

1. Check browser console for errors
2. Verify database setup with `02-verify-setup.sql`
3. Ensure all environment variables are set

---

**Version**: 1.0.0  
**Last Updated**: December 2024
