-- Create admin user
INSERT INTO admin_users (user_id, role, permissions, created_by) VALUES 
(
    1, -- Alex Johnson as admin
    'super_admin',
    '["user_management", "billing_management", "system_settings", "content_moderation", "analytics_access"]',
    NULL
) ON CONFLICT DO NOTHING;

-- Insert sample system metrics
INSERT INTO system_metrics (metric_name, metric_value, metric_unit, category) VALUES 
('total_users', 12450, 'count', 'users'),
('active_users_24h', 3240, 'count', 'users'),
('total_streams', 156780, 'count', 'usage'),
('concurrent_streams', 1240, 'count', 'usage'),
('total_revenue', 45230.50, 'usd', 'revenue'),
('monthly_revenue', 12450.00, 'usd', 'revenue'),
('server_cpu_usage', 65.5, 'percent', 'performance'),
('server_memory_usage', 78.2, 'percent', 'performance'),
('database_connections', 45, 'count', 'performance'),
('api_response_time', 125.5, 'ms', 'performance'),
('storage_used', 2.4, 'tb', 'usage'),
('bandwidth_used', 15.6, 'tb', 'usage') ON CONFLICT DO NOTHING;

-- Insert sample system alerts
INSERT INTO system_alerts (alert_type, title, message, severity) VALUES 
('warning', 'High CPU Usage', 'Server CPU usage has exceeded 80% for the last 15 minutes', 3),
('info', 'New Feature Deployed', 'AI-powered stream recommendations feature has been deployed successfully', 1),
('error', 'Payment Processing Issue', 'Stripe webhook endpoint is returning 500 errors', 4),
('warning', 'Storage Capacity', 'Storage usage is at 85% capacity. Consider scaling up.', 3) ON CONFLICT DO NOTHING;

-- Insert sample feature flags
INSERT INTO feature_flags (flag_name, description, is_enabled, rollout_percentage, created_by) VALUES 
('ai_recommendations', 'AI-powered content recommendations', true, 100, 1),
('advanced_analytics', 'Advanced analytics dashboard for creators', true, 50, 1),
('beta_mobile_app', 'Beta mobile application access', false, 10, 1),
('premium_chat_features', 'Premium chat moderation and features', true, 75, 1) ON CONFLICT DO NOTHING;

-- Insert sample moderation queue items
INSERT INTO moderation_queue (content_type, content_id, user_id, reported_by, reason, status) VALUES 
('stream', 1, 1, 2, 'inappropriate_content', 'pending'),
('chat', 123, 3, 1, 'spam', 'pending'),
('profile', 1, 4, 5, 'fake_profile', 'approved') ON CONFLICT DO NOTHING;

-- Insert sample admin activity logs
INSERT INTO admin_activity_logs (admin_id, action, target_type, target_id, details, ip_address) VALUES 
(1, 'user_suspended', 'user', 123, '{"reason": "violation_of_terms", "duration": "7_days"}', '192.168.1.100'),
(1, 'subscription_refunded', 'subscription', 456, '{"amount": 29.00, "reason": "customer_request"}', '192.168.1.100'),
(1, 'feature_flag_updated', 'system', NULL, '{"flag": "ai_recommendations", "enabled": true}', '192.168.1.100') ON CONFLICT DO NOTHING;
