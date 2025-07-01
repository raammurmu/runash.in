-- AI Tools Configuration
CREATE TABLE IF NOT EXISTS ai_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    settings JSONB DEFAULT '{}',
    usage_daily INTEGER DEFAULT 0,
    usage_monthly INTEGER DEFAULT 0,
    usage_limit INTEGER DEFAULT 1000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content Generation History
CREATE TABLE IF NOT EXISTS ai_content_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    tool_id UUID REFERENCES ai_tools(id),
    type VARCHAR(50) NOT NULL,
    prompt TEXT NOT NULL,
    content TEXT NOT NULL,
    alternatives JSONB DEFAULT '[]',
    confidence DECIMAL(3,2) DEFAULT 0.0,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auto Highlights
CREATE TABLE IF NOT EXISTS ai_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id UUID NOT NULL,
    user_id UUID NOT NULL,
    timestamp_start INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    confidence DECIMAL(3,2) DEFAULT 0.0,
    thumbnail_url VARCHAR(500),
    clip_url VARCHAR(500),
    tags JSONB DEFAULT '[]',
    engagement_score DECIMAL(3,1) DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Moderation Rules
CREATE TABLE IF NOT EXISTS ai_moderation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium',
    enabled BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Moderation Events
CREATE TABLE IF NOT EXISTS ai_moderation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id UUID NOT NULL,
    user_id UUID NOT NULL,
    username VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    rule_id UUID REFERENCES ai_moderation_rules(id),
    rule_name VARCHAR(100) NOT NULL,
    action_taken VARCHAR(50) NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Usage Analytics
CREATE TABLE IF NOT EXISTS ai_usage_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    tool_type VARCHAR(50) NOT NULL,
    usage_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    cost_usd DECIMAL(10,4) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date, tool_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_content_generations_user_id ON ai_content_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_content_generations_created_at ON ai_content_generations(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_highlights_stream_id ON ai_highlights(stream_id);
CREATE INDEX IF NOT EXISTS idx_ai_highlights_user_id ON ai_highlights(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_moderation_events_stream_id ON ai_moderation_events(stream_id);
CREATE INDEX IF NOT EXISTS idx_ai_moderation_events_created_at ON ai_moderation_events(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_analytics_user_date ON ai_usage_analytics(user_id, date);
