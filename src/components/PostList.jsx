import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PostList.css';
import PostCard from './PostCard';
import SearchBar from './SearchBar';
import { SkeletonList, LoadingContainer, EmptyState, ErrorState } from './LoadingStates';

const PostList = () => {
  const [allPosts, setAllPosts] = useState([]); // 存储所有数据
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const listRef = useRef(null);
  const loadingRef = useRef(false);

  // 模拟获取数据
  const fetchPosts = useCallback(async (pageNum, isRetry = false) => {
    if (loadingRef.current && !isRetry) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      // 模拟API调用
      const newPosts = Array.from({ length: 10 }, (_, i) => {
        const id = (pageNum - 1) * 10 + i + 1;
        return {
          id,
          title: `这是第 ${id} 个内容标题 - ${[
            '美食分享', '旅行攻略', '穿搭日记', '健身打卡', 
            '护肤心得', '学习笔记', '家居装饰', '宠物日常',
            '摄影技巧', '电影推荐'
          ][id % 10]}`,
          author: `用户${id.toString().padStart(3, '0')}`,
          likes: Math.floor(Math.random() * 1000) + 10,
          comments: Math.floor(Math.random() * 200) + 5, // 5-204 条评论
          image: `https://picsum.photos/300/${300 + Math.floor(Math.random() * 200)}?random=${id}`,
          createTime: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
        };
      });
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, isRetry ? 500 : 1000));
      
      setAllPosts(prev => pageNum === 1 ? newPosts : [...prev, ...newPosts]);
      
      // 模拟没有更多数据
      if (pageNum >= 5) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      setError('网络连接失败，请检查网络后重试');
    } finally {
      setLoading(false);
      setInitialLoading(false);
      loadingRef.current = false;
    }
  }, []);

  // 初始化加载数据
  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  // 无限滚动处理
  const handleScroll = useCallback(() => {
    if (loading || !hasMore || searchQuery) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.offsetHeight;
    
    if (scrollTop + windowHeight >= documentHeight - 200) {
      setPage(prev => {
        const nextPage = prev + 1;
        fetchPosts(nextPage);
        return nextPage;
      });
    }
  }, [loading, hasMore, searchQuery, fetchPosts]);

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 200);
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  // 节流函数
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // 处理点击事件
  const handlePostClick = useCallback((post) => {
    navigate(`/post/${post.id}`);
  }, [navigate]);

  // 处理搜索
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // 重试加载
  const handleRetry = useCallback(() => {
    setPage(1);
    setAllPosts([]);
    setHasMore(true);
    setError(null);
    fetchPosts(1, true);
  }, [fetchPosts]);

  // 过滤帖子
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return allPosts;
    const query = searchQuery.toLowerCase();
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    );
  }, [allPosts, searchQuery]);

  // 渲染错误状态
  if (error && allPosts.length === 0) {
    return (
      <div className="post-list-container">
        <SearchBar onSearch={handleSearch} placeholder="搜索帖子标题或作者..." />
        <ErrorState 
          title="加载失败"
          description={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="post-list-container">
      <SearchBar 
        onSearch={handleSearch} 
        placeholder="搜索帖子标题或作者..." 
        debounceMs={300}
      />
      
      {searchQuery && (
        <div className="search-results-info">
          <span className="search-results-text">
            搜索 “{searchQuery}” 找到 {filteredPosts.length} 个结果
          </span>
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              aria-label="清空搜索"
            >
              清空
            </button>
          )}
        </div>
      )}
      
      {/* 初始加载状态 */}
      {initialLoading ? (
        <SkeletonList count={6} />
      ) : (
        <>
          {/* 帖子列表 */}
          {filteredPosts.length > 0 ? (
            <div 
              ref={listRef}
              className="post-list"
              role="feed"
              aria-label="帖子列表"
            >
              {filteredPosts.map((post, index) => (
                <PostCard 
                  key={`${post.id}-${index}`}
                  post={post} 
                  onClick={handlePostClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon="🔍"
              title="没有找到相关内容"
              description="试试更换关键词或浏览其他内容"
              action={
                <button 
                  className="empty-action-btn"
                  onClick={() => setSearchQuery('')}
                >
                  清空搜索
                </button>
              }
            />
          )}
          
          {/* 加载更多状态 */}
          {!searchQuery && (
            <>
              {loading && (
                <LoadingContainer message="加载中..." />
              )}
              {!loading && !hasMore && allPosts.length > 0 && (
                <div className="no-more-content">
                  <span className="no-more-text">—— 没有更多内容了 ——</span>
                </div>
              )}
              {error && allPosts.length > 0 && (
                <div className="load-error">
                  <span className="error-text">加载失败</span>
                  <button className="retry-btn" onClick={handleRetry}>
                    点击重试
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PostList;