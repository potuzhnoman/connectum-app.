# Achievements System - Setup Guide

## 🗄️ Step 1: Database Migration

**IMPORTANT**: You need to run the SQL migration in your Supabase dashboard to create the `achievements` table.

### How to apply the migration:

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy the contents of [`supabase-migration.sql`](file:///c:/Users/levpo/Desktop/connectum/supabase-migration.sql)
5. Paste into the SQL editor
6. Click **Run** to execute the migration

This will create:
- ✅ `achievements` table
- ✅ Row Level Security (RLS) policies
- ✅ Database indexes for performance

---

## 🎮 How It Works

The achievements system automatically tracks user actions and unlocks badges based on milestones:

### Automatic Achievement Checking

The app automatically checks for achievements after these actions:
- 📝 **Posting a question**
- 💬 **Submitting an answer**
- ⭐ **Marking a best answer**

### Available Achievements

| Badge | Name | Unlock Condition |
|-------|------|-----------------|
| 🌟 | First Steps | Post your first question |
| 💡 | Helpful Hero | Receive 5 best answers |
| 🔥 | Answer Streak | Answer questions 3 days in a row |
| 🎯 | Sharp Shooter | Get 10 answers accepted |
| 👑 | Knowledge King | Reach 5000 XP |
| 🚀 | Early Adopter | Be in the first 100 users |
| 🌍 | Polyglot | Ask questions in 3+ languages |
| ⭐ | Rising Star | Gain 1000 XP in a week |
| 🏆 | Legendary | Reach level 10 |
| ⚡ | Speedster | First answer within 5 minutes |
| 🛡️ | Guardian | Help 50 people |
| ❤️ | Community Lover | Active for 30 days |

---

## 📍 Where to See Achievements

### 1. User Profile Modal
- Click on any user's avatar or name
- Achievements panel shows earned badges with progress bar
- Locked badges appear grayed out
- Hover over badges for details

### 2. Achievement Unlock Toast
- Animated notification appears at top of screen
- Shows when you unlock a new achievement
- Displays badge icon and description
- Auto-dismisses after 5 seconds

---

## 🧪 Testing the System

### Test Flow:

1. **Run the database migration** (see Step 1 above)
2. **Start the dev server**: `npm run dev`
3. **Login** with GitHub or Google
4. **Post your first question** → Should unlock "First Steps" 🌟
5. **Check your profile** → See the badge displayed
6. **Have someone mark your answer as best** → Progress toward other badges

### Manual Testing Checklist:

- [ ] Database migration applied successfully
- [ ] Can see achievements panel in user profile
- [ ] Achievement toast appears when unlocking
- [ ] Locked badges show as grayed out
- [ ] Tooltip displays on badge hover
- [ ] Progress bar updates correctly
- [ ] Recent unlocks section shows latest badges

---

## 🔧 Files Created

- `src/components/BadgeIcon.jsx` - Reusable badge component
- `src/components/AchievementsPanel.jsx` - Profile achievements display
- `src/components/AchievementToast.jsx` - Unlock notification
- `src/utils/useAchievements.js` - Achievement tracking hook
- `supabase-migration.sql` - Database schema

## 📝 Files Modified

- `src/App.jsx` - Integrated achievement tracking
- `src/components/UserProfileModal.jsx` - Added achievements panel

---

## 🎉 Ready to Go!

Once you've applied the database migration, the achievements system is fully functional and will automatically track user progress!
