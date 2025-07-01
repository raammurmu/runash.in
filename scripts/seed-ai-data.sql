-- Insert default AI tools
INSERT INTO ai_tools (name, description, category, settings, usage_limit) VALUES
('Content Generator', 'AI-powered content creation for titles, descriptions, and scripts', 'content', '{"models": ["gpt-4", "gpt-3.5-turbo"], "max_tokens": 500}', 500),
('Auto Highlights', 'Automatically detect and create highlight clips from streams', 'automation', '{"confidence_threshold": 0.7, "min_duration": 15, "max_duration": 120}', 100),
('Chat Moderation', 'AI-powered chat moderation and spam detection', 'moderation', '{"toxicity_threshold": 0.8, "spam_detection": true}', 10000),
('Thumbnail Generator', 'Create compelling thumbnails using AI', 'content', '{"styles": ["gaming", "educational", "entertainment"], "resolution": "1920x1080"}', 200),
('Stream Analytics', 'AI-powered insights and recommendations', 'analytics', '{"metrics": ["engagement", "retention", "growth"], "recommendations": true}', 1000);

-- Insert sample moderation rules
INSERT INTO ai_moderation_rules (user_id, name, type, action, severity, settings) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Spam Detection', 'spam', 'timeout', 'medium', '{"duration": 300, "threshold": 0.8}'),
('550e8400-e29b-41d4-a716-446655440000', 'Toxicity Filter', 'toxicity', 'warn', 'high', '{"threshold": 0.7, "escalate": true}'),
('550e8400-e29b-41d4-a716-446655440000', 'Profanity Filter', 'profanity', 'delete', 'low', '{"whitelist": ["damn", "hell"], "strict_mode": false}'),
('550e8400-e29b-41d4-a716-446655440000', 'Caps Lock Limit', 'caps', 'warn', 'low', '{"threshold": 0.7, "min_length": 10}'),
('550e8400-e29b-41d4-a716-446655440000', 'Link Blocker', 'links', 'delete', 'medium', '{"whitelist": ["youtube.com", "twitch.tv"], "trusted_users": true}');

-- Insert sample content generations
INSERT INTO ai_content_generations (user_id, tool_id, type, prompt, content, alternatives, confidence, tokens_used) VALUES
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM ai_tools WHERE name = 'Content Generator'), 'title', 'Gaming stream with viewer interaction', '🎮 EPIC Gaming Marathon - Chat Controls the Action!', '["Interactive Gaming Madness!", "Viewer-Controlled Gaming Stream", "Gaming Chaos with Chat Commands"]', 0.92, 45),
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM ai_tools WHERE name = 'Content Generator'), 'description', 'Educational coding stream', 'Join me for an in-depth coding session where we build amazing projects together! Perfect for beginners and experienced developers alike. Ask questions, suggest features, and learn by doing!', '["Learn to code with interactive tutorials", "Hands-on coding workshop for all levels"]', 0.88, 120);

-- Insert sample highlights
INSERT INTO ai_highlights (stream_id, user_id, timestamp_start, duration, title, description, confidence, thumbnail_url, clip_url, tags, engagement_score, status) VALUES
('123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', 1200, 30, 'Incredible Clutch Play', 'Amazing 1v4 clutch that had everyone screaming', 0.95, '/thumbnails/highlight_1.jpg', '/clips/highlight_1.mp4', '["clutch", "amazing", "gaming"]', 9.2, 'approved'),
('123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', 2400, 45, 'Hilarious Bug Discovery', 'Found the funniest bug that broke the game in the best way', 0.87, '/thumbnails/highlight_2.jpg', '/clips/highlight_2.mp4', '["funny", "bug", "comedy"]', 8.5, 'approved'),
('123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440000', 3600, 60, 'Pro Tips Segment', 'Shared advanced techniques that viewers loved', 0.82, '/thumbnails/highlight_3.jpg', '/clips/highlight_3.mp4', '["tutorial", "tips", "educational"]', 7.8, 'pending');

-- Insert sample moderation events
INSERT INTO ai_moderation_events (stream_id, user_id, username, message, rule_id, rule_name, action_taken, confidence) VALUES
('123e4567-e89b-12d3-a456-426614174000', '660e8400-e29b-41d4-a716-446655440001', 'spammer123', 'CHECK OUT MY CHANNEL!!! FOLLOW FOR FOLLOW!!!', (SELECT id FROM ai_moderation_rules WHERE name = 'Spam Detection'), 'Spam Detection', 'timeout', 0.92),
('123e4567-e89b-12d3-a456-426614174000', '770e8400-e29b-41d4-a716-446655440002', 'toxic_user', 'this stream is terrible and boring', (SELECT id FROM ai_moderation_rules WHERE name = 'Toxicity Filter'), 'Toxicity Filter', 'warn', 0.78);

-- Insert sample usage analytics
INSERT INTO ai_usage_analytics (user_id, date, tool_type, usage_count, tokens_used, cost_usd) VALUES
('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 'content', 15, 2500, 0.75),
('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 'moderation', 45, 0, 0.00),
('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, 'highlights', 3, 0, 0.00),
('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '1 day', 'content', 12, 2100, 0.63),
('550e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '1 day', 'moderation', 38, 0, 0.00);
