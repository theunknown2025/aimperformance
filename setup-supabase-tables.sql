-- Supabase SQL Script to recreate all tables from MySQL schema
-- This script creates all the tables from your AIM3 project in Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  company_size VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  representative_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  selected_event VARCHAR(100) NOT NULL,
  additional_info TEXT,
  accept_terms BOOLEAN NOT NULL DEFAULT FALSE,
  is_validated BOOLEAN NOT NULL DEFAULT FALSE,
  validated_at TIMESTAMP NULL,
  user_password VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create registration_activities table
CREATE TABLE IF NOT EXISTS registration_activities (
  id SERIAL PRIMARY KEY,
  registration_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  activity_id VARCHAR(100) NOT NULL,
  activity_label VARCHAR(255) NOT NULL,
  activity_category VARCHAR(100) NOT NULL
);

-- Create activity_options table
CREATE TABLE IF NOT EXISTS activity_options (
  id VARCHAR(100) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create MUR posts table
CREATE TABLE IF NOT EXISTS mur_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP NULL
);

-- Create indexes for mur_posts
CREATE INDEX IF NOT EXISTS idx_mur_posts_user_id ON mur_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_mur_posts_created_at ON mur_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_mur_posts_is_deleted ON mur_posts(is_deleted);

-- Create mur_post_images table
CREATE TABLE IF NOT EXISTS mur_post_images (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES mur_posts(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  image_name VARCHAR(255) NOT NULL,
  image_size INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for mur_post_images
CREATE INDEX IF NOT EXISTS idx_mur_post_images_post_id ON mur_post_images(post_id);

-- Create mur_post_documents table
CREATE TABLE IF NOT EXISTS mur_post_documents (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES mur_posts(id) ON DELETE CASCADE,
  document_url VARCHAR(500) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  document_size INTEGER NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for mur_post_documents
CREATE INDEX IF NOT EXISTS idx_mur_post_documents_post_id ON mur_post_documents(post_id);

-- Create mur_post_likes table
CREATE TABLE IF NOT EXISTS mur_post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES mur_posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

-- Create indexes for mur_post_likes
CREATE INDEX IF NOT EXISTS idx_mur_post_likes_post_id ON mur_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_mur_post_likes_user_id ON mur_post_likes(user_id);

-- Create mur_post_comments table
CREATE TABLE IF NOT EXISTS mur_post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES mur_posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP NULL
);

-- Create indexes for mur_post_comments
CREATE INDEX IF NOT EXISTS idx_mur_post_comments_post_id ON mur_post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_mur_post_comments_user_id ON mur_post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_mur_post_comments_created_at ON mur_post_comments(created_at);

-- Create mur_comment_likes table
CREATE TABLE IF NOT EXISTS mur_comment_likes (
  id SERIAL PRIMARY KEY,
  comment_id INTEGER NOT NULL REFERENCES mur_post_comments(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(comment_id, user_id)
);

-- Create indexes for mur_comment_likes
CREATE INDEX IF NOT EXISTS idx_mur_comment_likes_comment_id ON mur_comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_mur_comment_likes_user_id ON mur_comment_likes(user_id);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'individual' CHECK (type IN ('admin', 'individual', 'group')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_id INTEGER NULL
);

-- Create indexes for chats
CREATE INDEX IF NOT EXISTS idx_chats_type ON chats(type);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at);

-- Create chat_participants table
CREATE TABLE IF NOT EXISTS chat_participants (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_admin BOOLEAN DEFAULT FALSE,
  UNIQUE(chat_id, user_id)
);

-- Create indexes for chat_participants
CREATE INDEX IF NOT EXISTS idx_chat_participants_chat_id ON chat_participants(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON chat_participants(user_id);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Create indexes for chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp);

-- Add foreign key constraint for last_message_id in chats table
ALTER TABLE chats 
ADD CONSTRAINT fk_last_message 
FOREIGN KEY (last_message_id) REFERENCES chat_messages(id) ON DELETE SET NULL;

-- Insert activity options
INSERT INTO activity_options (id, label, category) VALUES
  ('exportateurs-directs', 'Exportateurs directs', 'Export'),
  ('exportateurs-indirects', 'Exportateurs indirects', 'Export'),
  ('marche-local', 'Marche local', 'Marche'),
  ('importateurs', 'Importateurs', 'Import'),
  ('fournisseurs-services', 'Fournisseurs de services', 'Services'),
  ('logistique-transport', 'Logistique et transport', 'Logistique'),
  ('finance-assurance', 'Finance et assurance', 'Finance'),
  ('conseil-consulting', 'Conseil et consulting', 'Conseil'),
  ('technologie-innovation', 'Technologie et innovation', 'Technologie'),
  ('autres', 'Autres', 'Autres')
ON CONFLICT (id) DO NOTHING;

-- Create admin chat and add initial data
INSERT INTO chats (name, type) VALUES ('Support Admin', 'admin')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) for better security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE mur_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mur_post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE mur_post_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE mur_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mur_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mur_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you may want to customize these based on your needs)
CREATE POLICY "Enable read access for all users" ON registrations FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON registrations FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON activity_options FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON registration_activities FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON registration_activities FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON mur_posts FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON mur_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON mur_posts FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON mur_post_images FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON mur_post_images FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON mur_post_documents FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON mur_post_documents FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON mur_post_likes FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON mur_post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON mur_post_likes FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON mur_post_comments FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON mur_post_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON mur_post_comments FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON mur_comment_likes FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON mur_comment_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON mur_comment_likes FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON chats FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON chats FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON chat_participants FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON chat_participants FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON chat_messages FOR INSERT WITH CHECK (true);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mur_posts_updated_at BEFORE UPDATE ON mur_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mur_post_comments_updated_at BEFORE UPDATE ON mur_post_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
