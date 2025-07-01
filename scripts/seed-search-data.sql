-- Insert default search indexes
INSERT INTO search_indexes (name, description, index_type, model_name, dimensions) VALUES
('users', 'User profiles and information', 'semantic', 'text-embedding-ada-002', 1536),
('files', 'User uploaded files and media', 'semantic', 'text-embedding-ada-002', 1536),
('streams', 'Live streams and recordings', 'semantic', 'text-embedding-ada-002', 1536),
('content', 'General platform content', 'hybrid', 'text-embedding-ada-002', 1536)
ON CONFLICT (name) DO NOTHING;

-- Insert sample search documents
INSERT INTO search_documents (index_id, document_type, document_id, title, content, metadata, keywords, tags, user_id, is_public) VALUES
(
  (SELECT id FROM search_indexes WHERE name = 'users' LIMIT 1),
  'user',
  '1',
  'John Doe - Content Creator',
  'John Doe is a popular content creator specializing in gaming and technology reviews. He has been streaming for over 3 years and has built a community of tech enthusiasts.',
  '{"follower_count": 15000, "verified": true, "categories": ["gaming", "tech"]}',
  ARRAY['gaming', 'technology', 'reviews', 'streaming'],
  ARRAY['creator', 'verified', 'gaming'],
  '550e8400-e29b-41d4-a716-446655440000',
  true
),
(
  (SELECT id FROM search_indexes WHERE name = 'files' LIMIT 1),
  'file',
  '1',
  'Gaming Setup Tutorial 2024',
  'Complete guide to setting up the perfect gaming streaming setup. Covers hardware recommendations, software configuration, and optimization tips for content creators.',
  '{"file_type": "video", "duration": 1800, "views": 5000}',
  ARRAY['gaming', 'setup', 'tutorial', 'streaming', 'hardware'],
  ARRAY['tutorial', 'gaming', 'setup'],
  '550e8400-e29b-41d4-a716-446655440000',
  true
),
(
  (SELECT id FROM search_indexes WHERE name = 'streams' LIMIT 1),
  'stream',
  '1',
  'Live Coding Session: Building a React App',
  'Join me as I build a complete React application from scratch. We will cover component architecture, state management, and deployment strategies.',
  '{"category": "programming", "language": "javascript", "viewers": 250}',
  ARRAY['react', 'javascript', 'programming', 'coding', 'tutorial'],
  ARRAY['live', 'coding', 'react'],
  '550e8400-e29b-41d4-a716-446655440000',
  true
);
