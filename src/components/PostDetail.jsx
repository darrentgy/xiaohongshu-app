import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostDetail.css';
import { LoadingContainer, ErrorState } from './LoadingStates';
import Comments from './Comments';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [commentsData, setCommentsData] = useState([]);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  // 获取帖子详情
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟错误情况
        if (Math.random() < 0.1) {
          throw new Error('网络连接失败');
        }
        
        const mockPost = {
          id: parseInt(id),
          title: `这是第 ${id} 个内容的详细标题 - ${[
            '美食探店心得', '旅行攻略分享', '穿搭日记记录', '健身打卡日常',
            '护肤心得体验', '学习笔记整理', '家居装饰灵感', '宠物日常记录',
            '摄影技巧分享', '电影观后感'
          ][parseInt(id) % 10]}`,
          author: `用户${id.toString().padStart(3, '0')}`,
          content: `这是第 ${id} 个内容的详细描述。

🌟 今天想和大家分享一下最近的一些体验和感受，希望能对大家有所帮助。

✨ 详细内容：

第一部分：前期准备
- 首先需要做好充分的调研和准备工作
- 列出所有必需的物品清单
- 设定合理的预期和目标

第二部分：实际操作
1. 按照计划逐步执行
2. 注意记录过程中的问题和体验
3. 及时调整策略和方法

第三部分：总结反思
✅ 成功的经验和做法
❌ 遇到的困难和解决方案
💡 未来的改进计划

希望这篇分享能够帮助到有需要的朋友们！如果你们有任何问题或者想法，欢迎在评论区交流讨论呀～

#生活分享 #经验总结 #实用技巧`,
          likes: Math.floor(Math.random() * 2000) + 100,
          comments: Math.floor(Math.random() * 300) + 10,
          image: `https://picsum.photos/800/1200?random=${id}`,
          publishTime: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          tags: [
            '#生活分享', '#经验总结', '#实用技巧',
            '#日常记录', '#小红书'
          ].slice(0, Math.floor(Math.random() * 3) + 2)
        };
        
        setPost(mockPost);
        setLikesCount(mockPost.likes);
        setCommentsCount(mockPost.comments);
        
        // 生成模拟评论数据
        const mockComments = Array.from({ length: Math.floor(Math.random() * 8) + 2 }, (_, i) => ({
          id: Date.now() + i,
          content: [
            '这个分享太实用了！收藏了～',
            '哇，学到了新知识，感谢分享！',
            '我也有类似的经历，确实是这样的',
            '图片拍得真好看，请问用什么设备拍的？',
            '期待更多这样的内容分享',
            '已经按照你的方法试了，真的很有效！',
            '同感同感，深有体会',
            '请问还有其他相关的建议吗？',
            '太赞了，正好需要这个信息',
            '分享得很详细，很有帮助'
          ][Math.floor(Math.random() * 10)],
          author: `用户${(i + 1).toString().padStart(3, '0')}`,
          userId: i + 1,
          createTime: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          likes: Math.floor(Math.random() * 50),
          isLiked: Math.random() > 0.7,
          replyTo: null
        }));
        
        setCommentsData(mockComments);
      } catch (err) {
        console.error('获取帖子详情失败:', err);
        setError(err.message || '加载失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // 返回上一页
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // 重试加载
  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  // 处理点赞
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // 处理添加评论
  const handleCommentAdd = (newComment) => {
    setCommentsCount(prev => prev + 1);
    setCommentsData(prev => [...prev, newComment]);
  };

  // 跳转到评论区
  const scrollToComments = () => {
    const commentsSection = document.querySelector('.post-detail__comments');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 处理图片加载
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleBack();
    }
  };

  // 添加键盘事件监听
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 格式化时间
  const formatTime = (timeString) => {
    const now = new Date();
    const publishDate = new Date(timeString);
    const diffMs = now - publishDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}天前`;
    } else if (diffHours > 0) {
      return `${diffHours}小时前`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}分钟前`;
    } else {
      return '刚刚';
    }
  };

  // 加载状态
  if (loading) {
    return (
      <div className="post-detail">
        <header className="post-detail__header">
          <button className="back-button" onClick={handleBack} aria-label="返回">
            ← 返回
          </button>
        </header>
        <LoadingContainer message="加载中..." />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="post-detail">
        <header className="post-detail__header">
          <button className="back-button" onClick={handleBack} aria-label="返回">
            ← 返回
          </button>
        </header>
        <ErrorState 
          title="加载失败"
          description={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // 内容不存在
  if (!post) {
    return (
      <div className="post-detail">
        <header className="post-detail__header">
          <button className="back-button" onClick={handleBack} aria-label="返回">
            ← 返回
          </button>
        </header>
        <ErrorState 
          icon="📄"
          title="内容不存在"
          description="您访问的内容可能已被删除或不存在"
        />
      </div>
    );
  }

  return (
    <article className="post-detail" ref={contentRef}>
      <header className="post-detail__header">
        <button 
          className="back-button" 
          onClick={handleBack}
          aria-label="返回上一页"
        >
          ← 返回
        </button>
        <h1 className="post-detail__title">{post.title}</h1>
      </header>
      
      <main className="post-detail__content">
        <div className="post-detail__main">
          {/* 图片区域 */}
          <div className="post-detail__image-container">
            {!imageLoaded && (
              <div className="post-detail__image-skeleton">
                <div className="post-detail__loading-spinner"></div>
              </div>
            )}
            {!imageError ? (
              <img 
                ref={imageRef}
                src={post.image} 
                alt={post.title}
                className={`post-detail__image ${
                  imageLoaded ? 'post-detail__image--loaded' : 'post-detail__image--loading'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <div className="post-detail__image-error">
                <span className="post-detail__error-icon">🖼️</span>
                <span className="post-detail__error-text">图片加载失败</span>
              </div>
            )}
          </div>
          
          {/* 文本内容 */}
          <div className="post-detail__text-content">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') {
                return <br key={index} />;
              }
              return (
                <p key={index} className="post-detail__paragraph">
                  {paragraph}
                </p>
              );
            })}
          </div>
          
          {/* 标签 */}
          {post.tags && post.tags.length > 0 && (
            <div className="post-detail__tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="post-detail__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* 帖子信息区域 */}
        <div className="post-detail__meta">
          <div className="post-detail__author-info">
            <div className="post-detail__author-details">
              <span className="post-detail__author-name">{post.author}</span>
              <span className="post-detail__publish-time">
                {formatTime(post.publishTime)}
              </span>
            </div>
          </div>
          
          <div className="post-detail__actions">
            <button 
              className={`post-detail__action-btn post-detail__like-btn ${
                isLiked ? 'post-detail__like-btn--active' : ''
              }`}
              onClick={handleLike}
              aria-label={isLiked ? '取消点赞' : '点赞'}
            >
              <span className="post-detail__action-icon">
                {isLiked ? '❤️' : '🤍'}
              </span>
              <span className="post-detail__action-count">{likesCount}</span>
            </button>
            
            <button className="post-detail__action-btn" onClick={scrollToComments}>
              <span className="post-detail__action-icon">💬</span>
              <span className="post-detail__action-count">{commentsCount}</span>
            </button>
            
            <button className="post-detail__action-btn">
              <span className="post-detail__action-icon">🔖</span>
              <span className="post-detail__action-text">分享</span>
            </button>
          </div>
        </div>
      </main>
      
      {/* 评论区域 */}
      <section className="post-detail__comments">
        <Comments 
          postId={post.id}
          initialComments={commentsData}
          onCommentAdd={handleCommentAdd}
        />
      </section>
    </article>
  );
};

export default PostDetail;