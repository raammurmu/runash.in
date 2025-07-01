-- Insert sample user
INSERT INTO users (id, email, name, username, bio, website, location) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'alex@runash.ai',
    'Alex Johnson',
    'alexj_streams',
    'Tech enthusiast and live streamer passionate about AI and gaming. Building the future of interactive content.',
    'https://alexjohnson.dev',
    'San Francisco, CA'
) ON CONFLICT (email) DO NOTHING;

-- Insert default preferences for the sample user
INSERT INTO user_preferences (user_id) VALUES 
('550e8400-e29b-41d4-a716-446655440000') ON CONFLICT DO NOTHING;

-- Insert default notifications for the sample user
INSERT INTO user_notifications (user_id) VALUES 
('550e8400-e29b-41d4-a716-446655440000') ON CONFLICT DO NOTHING;

-- Insert default security settings for the sample user
INSERT INTO user_security (user_id, two_factor_enabled) VALUES 
('550e8400-e29b-41d4-a716-446655440000', true) ON CONFLICT DO NOTHING;

-- Insert sample sessions
INSERT INTO user_sessions (user_id, device_name, device_type, ip_address, location, user_agent, is_current, last_active) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440000',
    'MacBook Pro',
    'desktop',
    '192.168.1.1',
    'San Francisco, CA',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    true,
    NOW()
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'iPhone 15 Pro',
    'mobile',
    '192.168.1.2',
    'San Francisco, CA',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    false,
    NOW() - INTERVAL '2 hours'
),
(
    '550e8400-e29b-41d4-a716-446655440000',
    'Chrome on Windows',
    'desktop',
    '203.0.113.1',
    'New York, NY',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    false,
    NOW() - INTERVAL '3 days'
) ON CONFLICT DO NOTHING;
