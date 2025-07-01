-- Test Search Functionality
-- This script demonstrates various search scenarios

-- 1. Test basic keyword search for "AI"
SELECT 'Testing keyword search for "AI"' as test_description;
SELECT 
  title,
  content_type,
  tags,
  CASE 
    WHEN LOWER(title) LIKE '%ai%' THEN 1.0
    WHEN LOWER(content) LIKE '%ai%' THEN 0.8
    ELSE 0.6
  END as relevance_score
FROM search_documents
WHERE (
  LOWER(title) LIKE '%ai%' OR 
  LOWER(content) LIKE '%ai%' OR
  EXISTS (SELECT 1 FROM unnest(tags) tag WHERE LOWER(tag) LIKE '%ai%')
)
ORDER BY relevance_score DESC;

-- 2. Test content type filtering for streams
SELECT 'Testing content type filter for streams' as test_description;
SELECT 
  title,
  content_type,
  tags,
  metadata
FROM search_documents
WHERE content_type = 'stream'
ORDER BY title;

-- 3. Test tag-based search for gaming content
SELECT 'Testing tag-based search for gaming' as test_description;
SELECT 
  title,
  content_type,
  tags,
  metadata
FROM search_documents
WHERE 'gaming' = ANY(tags)
ORDER BY title;

-- 4. Test multi-filter search (streams with AI tags)
SELECT 'Testing multi-filter search (streams with AI/tutorial tags)' as test_description;
SELECT 
  title,
  content_type,
  tags,
  metadata
FROM search_documents
WHERE content_type = 'stream'
  AND (tags && ARRAY['ai', 'tutorial'])
ORDER BY title;

-- 5. Test search analytics - top queries
SELECT 'Testing search analytics - top queries' as test_description;
SELECT 
  query,
  COUNT(*) as search_count,
  AVG(response_time) as avg_response_time
FROM search_queries
GROUP BY query
ORDER BY search_count DESC
LIMIT 5;

-- 6. Test content popularity by search frequency
SELECT 'Testing content popularity by search mentions' as test_description;
SELECT 
  sd.title,
  sd.content_type,
  COUNT(sq.id) as mention_count
FROM search_documents sd
LEFT JOIN search_queries sq ON (
  LOWER(sq.query) LIKE '%' || LOWER(SPLIT_PART(sd.title, ' ', 1)) || '%'
)
GROUP BY sd.id, sd.title, sd.content_type
HAVING COUNT(sq.id) > 0
ORDER BY mention_count DESC;

-- 7. Test search suggestions based on existing content
SELECT 'Testing search suggestions for partial query "music"' as test_description;
SELECT DISTINCT 
  title as suggestion,
  'content' as suggestion_type
FROM search_documents
WHERE LOWER(title) LIKE '%music%'
UNION
SELECT DISTINCT 
  query as suggestion,
  'query' as suggestion_type
FROM search_queries
WHERE LOWER(query) LIKE '%music%'
ORDER BY suggestion
LIMIT 5;

-- 8. Test comprehensive search across all content types
SELECT 'Testing comprehensive search for "tutorial"' as test_description;
SELECT 
  title,
  content_type,
  tags,
  CASE 
    WHEN LOWER(title) LIKE '%tutorial%' THEN 1.0
    WHEN LOWER(content) LIKE '%tutorial%' THEN 0.8
    WHEN EXISTS (SELECT 1 FROM unnest(tags) tag WHERE LOWER(tag) LIKE '%tutorial%') THEN 0.9
    ELSE 0.5
  END as relevance_score,
  LENGTH(content) as content_length
FROM search_documents
WHERE (
  LOWER(title) LIKE '%tutorial%' OR 
  LOWER(content) LIKE '%tutorial%' OR
  EXISTS (SELECT 1 FROM unnest(tags) tag WHERE LOWER(tag) LIKE '%tutorial%')
)
ORDER BY relevance_score DESC, content_length DESC;

-- 9. Test search performance metrics
SELECT 'Testing search performance metrics' as test_description;
SELECT 
  search_type,
  COUNT(*) as total_searches,
  AVG(response_time) as avg_response_time,
  AVG(results_count) as avg_results_count
FROM search_queries
GROUP BY search_type
ORDER BY total_searches DESC;

-- 10. Test recent search trends
SELECT 'Testing recent search trends' as test_description;
SELECT 
  DATE(created_at) as search_date,
  COUNT(*) as daily_searches,
  COUNT(DISTINCT query) as unique_queries
FROM search_queries
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY search_date DESC;
