# Connectum - Global Knowledge Network

A modern Q&A platform built with React, Supabase, and Vercel. Connect with experts worldwide, ask questions in any language, and earn XP by contributing to the global knowledge network.

## 🚀 Features

### Core Functionality
- **Multi-language Q&A**: Ask questions and receive answers in any language
- **Real-time Updates**: Live updates using Supabase Realtime
- **XP System**: Earn points for contributing and helping others
- **Leaderboard**: Compete with top contributors
- **User Profiles**: Customizable profiles with avatars and stats

### Authentication & Security
- **Social Auth**: Sign in with Google, GitHub, or email
- **Row Level Security**: Secure data access with Supabase RLS
- **Session Management**: Persistent authentication state

### Advanced Features
- **File Uploads**: Attach images and documents to questions
- **Push Notifications**: Real-time notifications for replies and mentions
- **Offline Support**: PWA functionality with service worker
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Meta tags and structured data

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Authentication Service
  - Realtime Subscriptions
  - File Storage
  - Edge Functions

### Deployment
- **Vercel** - Frontend deployment
- **Supabase** - Backend hosting

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/connectum.git
cd connectum
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL setup script in `supabase-setup.sql` in your Supabase SQL Editor
3. Enable the following providers in Authentication > Settings:
   - Email
   - Google (add your OAuth credentials)
   - GitHub (add your OAuth credentials)

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings:
- Go to Project Settings > API
- Copy the Project URL and anon public key

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 📁 Project Structure

```
connectum/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── src/
│   ├── api.js                 # Supabase client and utilities
│   ├── components/
│   │   ├── AuthModal.jsx      # Authentication modal
│   │   ├── FileUpload.jsx     # File upload component
│   │   ├── NotificationCenter.jsx # Notification system
│   │   └── ...                # Other components
│   ├── contexts/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── hooks/
│   │   └── useRealtime.js     # Realtime subscriptions
│   ├── pages/
│   │   ├── Home.jsx           # Home page
│   │   └── QuestionPage.jsx   # Question detail page
│   └── App.jsx                # Main app component
├── supabase-setup.sql         # Database schema
└── package.json
```

## 🔧 Configuration

### Supabase Setup

1. **Database Schema**: Run the `supabase-setup.sql` script to create all necessary tables
2. **Authentication**: Configure OAuth providers in Supabase Dashboard
3. **Storage**: Create storage buckets for avatars and attachments
4. **Realtime**: Enable realtime for questions, replies, and notifications

### Environment Variables

```env
# Required
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for production)
VITE_APP_URL=https://your-domain.com
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel Dashboard
4. Deploy!

### Manual Deployment

```bash
npm run build
npm run preview
```

## 📱 PWA Features

This app includes Progressive Web App functionality:

- **Offline Support**: Cache resources for offline viewing
- **Installable**: Add to home screen on mobile devices
- **Push Notifications**: Receive notifications for new replies
- **Background Sync**: Sync offline actions when back online

## 🔐 Security

- **Row Level Security (RLS)**: Database policies ensure users can only access their own data
- **JWT Authentication**: Secure token-based authentication
- **HTTPS Only**: Production deployment requires HTTPS
- **Input Validation**: Client and server-side validation
- **File Upload Security**: Restricted file types and sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-username/connectum/issues) page
2. Create a new issue with detailed information
3. Join our [Discord community](https://discord.gg/connectum)

## 🌟 Star History

If this project helped you, please give it a star ⭐

---

Built with ❤️ by the Connectum team
