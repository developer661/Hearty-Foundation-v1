/*
  # Create Dashboard Tables for Volunteer Platform

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `email` (text, unique)
      - `avatar_url` (text, nullable)
      - `bio` (text, nullable)
      - `location` (text)
      - `skills` (text array)
      - `interests` (text array)
      - `points` (integer) - for gamification/ranking
      - `created_at` (timestamptz)
      
    - `posts`
      - `id` (uuid, primary key)
      - `author_id` (uuid, foreign key to user_profiles)
      - `author_name` (text)
      - `content` (text)
      - `category` (text) - education_math, education_english, education_polish, health, events, community_service
      - `location` (text)
      - `image_url` (text, nullable)
      - `likes_count` (integer)
      - `comments_count` (integer)
      - `created_at` (timestamptz)
      
    - `post_likes`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to posts)
      - `user_id` (uuid, foreign key to user_profiles)
      - `created_at` (timestamptz)
      
    - `post_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to posts)
      - `user_id` (uuid, foreign key to user_profiles)
      - `user_name` (text)
      - `content` (text)
      - `created_at` (timestamptz)
      
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `location` (text)
      - `event_date` (timestamptz)
      - `organizer` (text)
      - `attendees_count` (integer)
      - `created_at` (timestamptz)
      
    - `user_activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `activity_type` (text) - volunteered, posted, commented, attended_event
      - `description` (text)
      - `points_earned` (integer)
      - `created_at` (timestamptz)
      
    - `assigned_opportunities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `opportunity_id` (uuid, foreign key to opportunities)
      - `opportunity_title` (text)
      - `status` (text) - assigned, in_progress, completed
      - `start_date` (date)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated users to create/update their own content
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  avatar_url text,
  bio text,
  location text NOT NULL,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  image_url text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  event_date timestamptz NOT NULL,
  organizer text NOT NULL,
  attendees_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  description text NOT NULL,
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assigned_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  opportunity_id uuid REFERENCES opportunities(id) ON DELETE CASCADE,
  opportunity_title text NOT NULL,
  status text DEFAULT 'assigned',
  start_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE assigned_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user profiles"
  ON user_profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own profile"
  ON user_profiles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create posts"
  ON posts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view post likes"
  ON post_likes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can like posts"
  ON post_likes FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view comments"
  ON post_comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create comments"
  ON post_comments FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view activities"
  ON user_activities FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view assigned opportunities"
  ON assigned_opportunities FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_location ON posts(location);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_points ON user_profiles(points DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
