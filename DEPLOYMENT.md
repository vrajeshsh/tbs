# Deployment & Setup Guide

This guide will walk you through setting up your production-ready portfolio, connecting the database, and deploying to Netlify.

## 1. Prerequisites
- A [GitHub](https://github.com) account.
- A [Netlify](https://netlify.com) account.
- A [Supabase](https://supabase.com) account (for the database).

---

## 2. Database Setup (Supabase)

Supabase is a powerful, open-source Firebase alternative. We use it to store your projects, blog posts, and subscribers.

### Step 1: Create a Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project**.
3. Give it a name (e.g., `vrajesh-portfolio`) and set a secure database password.
4. Choose a region close to you.

### Step 2: Create Tables
Go to the **SQL Editor** in the left sidebar and run the following commands to create your tables:

```sql
-- Create Projects Table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  tech_stack text[],
  github_url text,
  demo_url text,
  tags text[],
  image_url text,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Blog Posts Table
create table posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  author text,
  published_at timestamp with time zone default timezone('utc'::text, now()) not null,
  image_url text,
  tags text[]
);

-- Create Subscribers Table
create table subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Step 3: Get API Keys
1. Go to **Project Settings** > **API**.
2. Copy your **Project URL** and **anon public** key. You'll need these for Netlify.

---

## 3. GitHub & Netlify Deployment

### Step 1: Create GitHub Repo
1. Create a new repository on GitHub.
2. Push this code to your repository.

### Step 2: Connect to Netlify
1. Log in to [Netlify](https://netlify.com).
2. Click **Add new site** > **Import an existing project**.
3. Connect your GitHub account and select your repository.
4. Set the build command to `npm run build` and the publish directory to `dist`.

### Step 3: Set Environment Variables
In Netlify, go to **Site settings** > **Environment variables** and add:
- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon public key.
- `GEMINI_API_KEY`: (Optional) If you use any AI features.

---

## 4. Updating Content

### Admin Panel
You can access your admin panel at `/admin`. 
- **Default Password**: `admin123` (Change this in `src/pages/Admin.tsx`).
- Use this panel to manage your blog posts and projects manually.

### GitHub Integration
The "Archive" section on the Projects page automatically pulls your public repositories from GitHub. To show a project there, just make sure it's public on your GitHub profile (`vrajeshsh`).

---

## 5. Contact Form & Subscriptions
The contact form and subscription system are ready to be connected to Netlify Functions or a service like Formspree. 

To enable email notifications via Netlify:
1. Go to **Site settings** > **Forms**.
2. Enable Form detection.
3. Update the `form` tag in `Contact.tsx` to include `data-netlify="true"`.

---

## 6. Customizing the Brand
- **Logo**: Replace the placeholder in `Navbar.tsx` and `Footer.tsx`.
- **Photo**: Replace the image URL in `About.tsx`.
- **Resume**: Upload your PDF to the `public` folder and update the link in `About.tsx`.
