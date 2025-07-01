-- Create search-related tables
CREATE TABLE IF NOT EXISTS search_indexes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  index_type VARCHAR(50) NOT NULL DEFAULT 'semantic', -- semantic, keyword, hybrid
  model_name VARCHAR(255) DEFAULT 'text-embedding-ada-002',
  dimensions INTEGER DEFAULT 1536,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  index_id INTEGER REFERENCES search_indexes(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL, -- user, file, stream, content
  document_id VARCHAR(255) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1536), -- For pgvector extension
  keywords TEXT[],
  tags TEXT[],
  user_id UUID,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  query_text TEXT NOT NULL,
  query_type VARCHAR(50) DEFAULT 'semantic', -- semantic, keyword, hybrid
  filters JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES search_queries(id) ON DELETE CASCADE,
  document_id UUID REFERENCES search_documents(id) ON DELETE CASCADE,
  relevance_score FLOAT NOT NULL,
  rank_position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES search_queries(id) ON DELETE CASCADE,
  document_id UUID REFERENCES search_documents(id) ON DELETE CASCADE,
  user_id UUID,
  feedback_type VARCHAR(50) NOT NULL, -- helpful, not_helpful, irrelevant
  feedback_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_search_documents_type ON search_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_search_documents_user ON search_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_search_documents_public ON search_documents(is_public);
CREATE INDEX IF NOT EXISTS idx_search_documents_keywords ON search_documents USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_search_documents_tags ON search_documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_search_documents_metadata ON search_documents USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_search_queries_user ON search_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_created ON search_queries(created_at);

-- Enable pgvector extension if available
-- CREATE EXTENSION IF NOT EXISTS vector;
-- CREATE INDEX IF NOT EXISTS idx_search_documents_embedding ON search_documents USING ivfflat (embedding vector_cosine_ops);
