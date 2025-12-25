-- Connectum Achievements System Migration
-- Run this in your Supabase SQL Editor

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, badge_type)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON achievements(earned_at DESC);

-- Enable Row Level Security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view achievements
CREATE POLICY "Achievements are viewable by everyone" 
  ON achievements FOR SELECT 
  USING (true);

-- RLS Policy: Users can insert their own achievements (for manual unlocks)
CREATE POLICY "Users can insert own achievements" 
  ON achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Only system/admin can update achievements
CREATE POLICY "Achievements are immutable" 
  ON achievements FOR UPDATE 
  USING (false);

-- RLS Policy: Users can delete their own achievements (for reset)
CREATE POLICY "Users can delete own achievements" 
  ON achievements FOR DELETE 
  USING (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE achievements IS 'Stores user achievement badges and unlock timestamps';
COMMENT ON COLUMN achievements.badge_type IS 'Type of achievement: first_question, helpful_hero, answer_streak, etc.';
COMMENT ON COLUMN achievements.metadata IS 'Additional data like streak count, milestone number, etc.';
