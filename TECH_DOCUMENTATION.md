# MicroCRM Technical Documentation

## Project Overview

MicroCRM is a React-based Customer Relationship Management system designed for small teams (under 50 people). It emphasizes ease of use and seamless third-party integrations, particularly with LinkedIn Navigator for lead generation and contact management.

## User Requirements & Prompts

### Initial Requirements
- **Target Audience**: Teams under 50 people, ideally smaller
- **Key Focus**: Easy to use interface and simple third-party integrations
- **Core Functionality**: Contact management, lead generation, insights

### Specific Integration Request
- **Prompt**: "Needs ability to integrate with Linkedin navigator"
- **Implementation**: Created token-based LinkedIn Navigator integration with contact import functionality

### Technical Issues Resolved
- **Error**: "Uncaught Error: Missing Supabase environment variables"
- **Solution**: Implemented fallback Supabase client configuration to prevent blank screen crashes

## Technology Stack

### Frontend Framework
- **React 18.3.1** (.tsx, .ts files)
- **TypeScript** for type safety
- **Vite** as build tool and dev server

### UI/Styling
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Radix UI** primitives
- **Lucide React** for icons

### Backend & Database
- **Supabase** for authentication and database
- **Edge Functions** for serverless API endpoints

### Routing & State Management
- **React Router DOM** for client-side routing
- **TanStack Query** for server state management
- **React Context** for authentication state

## File Structure & Extensions

### Core Application Files (.tsx)
```
src/
├── App.tsx                          # Main app component with routing
├── main.tsx                         # React app entry point
├── components/
│   ├── auth/
│   │   ├── AuthPage.tsx            # Sign in/up forms
│   │   └── AuthGuard.tsx           # Route protection
│   ├── layout/
│   │   ├── Layout.tsx              # Main app layout
│   │   ├── Header.tsx              # Top navigation
│   │   └── Sidebar.tsx             # Side navigation
│   └── ui/                         # shadcn/ui components (.tsx)
├── pages/
│   ├── Dashboard.tsx               # Main dashboard
│   ├── Contacts.tsx                # Contact management
│   ├── Integrations.tsx            # Third-party integrations
│   ├── Messages.tsx                # Communication hub
│   ├── Email.tsx                   # Email management
│   ├── Insights.tsx                # Analytics & insights
│   └── AdminManagement.tsx         # User management
└── hooks/
    └── useAuth.tsx                 # Authentication hook
```

### Configuration Files
- **vite.config.ts** - Vite configuration
- **tailwind.config.ts** - Tailwind CSS configuration
- **tsconfig.json** - TypeScript configuration
- **package.json** - Dependencies and scripts

### Styling Files (.css)
- **src/index.css** - Global styles and CSS variables
- **src/App.css** - App-specific styles

### Database Files (.sql)
- **database-setup.sql** - Supabase database schema

### Edge Functions (Future) (.ts)
- **supabase/functions/analyze-web-content/index.ts** - Content analysis API

## Key Features Implemented

### 1. LinkedIn Navigator Integration
**Location**: `src/pages/Integrations.tsx`

```typescript
// Token-based authentication
const handleLinkedInConnect = async () => {
  if (!linkedInToken.trim()) {
    toast.error("Please enter your LinkedIn Navigator API token");
    return;
  }
  // Token validation and storage logic
};

// Contact import functionality
const handleImportContacts = async () => {
  // LinkedIn API integration for contact import
};
```

### 2. Supabase Client Configuration
**Location**: `src/integrations/supabase/client.ts`

```typescript
// Multi-source configuration with fallbacks
const runtime: any = (globalThis as any).__LOVABLE__ || (window as any).__LOVABLE__;
const injectedUrl: string | undefined = runtime?.supabaseUrl;
const injectedAnonKey: string | undefined = runtime?.supabaseAnonKey;
const injectedClient: SupabaseClient | undefined = runtime?.supabase;

// Fallback client to prevent crashes
if (injectedClient) {
  client = injectedClient;
} else if (supabaseUrl && supabaseAnonKey) {
  client = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('[MicroCRM] Supabase not configured...');
  client = createClient('https://invalid.supabase.co', 'public-anon-key');
}
```

### 3. Authentication System
**Location**: `src/hooks/useAuth.tsx`

- User profile management with roles (super_admin, admin, user)
- Automatic profile fetching on authentication
- Role-based access control

## Step-by-Step Deployment to Third-Party Host

### Option 1: Vercel Deployment

1. **Prerequisites**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   ```

2. **Build the Project**
   ```bash
   # Install dependencies
   npm install
   
   # Build for production
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

4. **Environment Variables Setup**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

### Option 2: Netlify Deployment

1. **Build the Project**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Environment Variables**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Add the same Supabase environment variables

### Option 3: Digital Ocean App Platform

1. **Create App Spec**
   ```yaml
   # app.yaml
   name: microcrm
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/your-repo
       branch: main
     run_command: npm start
     build_command: npm run build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: VITE_SUPABASE_URL
       value: your_supabase_url
     - key: VITE_SUPABASE_ANON_KEY
       value: your_supabase_anon_key
   ```

2. **Deploy**
   ```bash
   doctl apps create --spec app.yaml
   ```

### Option 4: AWS S3 + CloudFront

1. **Build and Upload**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

2. **CloudFront Distribution**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom error pages for React Router

### Option 5: Traditional Web Hosting (cPanel/FTP)

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Upload Files**
   - Upload contents of `dist/` folder to public_html or www directory
   - Ensure `.htaccess` file for React Router:
   ```apache
   Options -MultiViews
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^ index.html [QR,L]
   ```

## Environment Variables Required

### Production Environment
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anonymous-key
```

### LinkedIn Integration (Optional)
```bash
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

## Database Setup

### Supabase Configuration
1. Create new Supabase project
2. Run the SQL from `database-setup.sql`
3. Configure Row Level Security (RLS)
4. Set up authentication providers if needed

### Required Tables
- `user_profiles` - User management and roles
- `contacts` - Contact information
- `insights` - Analytics data
- `generated_leads` - Lead management

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Supabase RLS**: Ensure Row Level Security is properly configured
3. **API Keys**: Store third-party API keys securely
4. **Authentication**: Implement proper role-based access control

## Performance Optimizations

1. **Code Splitting**: React.lazy() for route-based splitting
2. **Image Optimization**: Proper alt tags and lazy loading
3. **Bundle Analysis**: Use `npm run build` to analyze bundle size
4. **Caching**: Configure proper caching headers for production

## Support & Maintenance

### Monitoring
- Set up error tracking (Sentry recommended)
- Monitor Core Web Vitals
- Track user engagement metrics

### Updates
- Regular dependency updates
- Security patches
- Feature enhancements based on user feedback

---

*Generated: January 2025*
*Version: 1.0*