/*
  # Create Favorites Table

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key) - Unique identifier for each favorite
      - `user_id` (uuid, foreign key to auth.users) - The user who favorited the item
      - `item_type` (text) - Type of item: 'urgent_need' or 'event'
      - `item_id` (uuid) - ID of the favorited item (urgent need or event)
      - `created_at` (timestamptz) - When the item was favorited

  2. Security
    - Enable RLS on `favorites` table
    - Add policy for authenticated users to view their own favorites
    - Add policy for authenticated users to insert their own favorites
    - Add policy for authenticated users to delete their own favorites

  3. Indexes
    - Add index on (user_id, item_type, item_id) for efficient lookups and to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('urgent_need', 'event')),
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user_item 
  ON favorites(user_id, item_type, item_id);