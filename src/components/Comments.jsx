import React, { useState, useRef, useEffect } from 'react';
import './Comments.css';
import { EmptyState } from './LoadingStates';

const Comments = ({ postId, initialComments = [], onCommentAdd }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const textareaRef = useRef(null);
  const commentsEndRef = useRef(null);

  // 生成随机用户头像
  const getAvatarEmoji = (userId) => {
    const avatars = ['👤', '👨', '👩', '🧑', '👦', '👧', '🙍', '🙎', '🙋', '🤷'];
    return avatars[userId % avatars.length];
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return time.toLocaleDateString();
  };

  // 添加评论
  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = newComment.trim();
    if (!content) return;

    setIsSubmitting(true);
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const comment = {
        id: Date.now() + Math.random(),
        content,
        author: `用户${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        userId: Math.floor(Math.random() * 10),
        createTime: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        replyTo: replyTo ? {
          id: replyTo.id,
          author: replyTo.author
        } : null
      };

      setComments(prev => [...prev, comment]);
      setNewComment('');
      setReplyTo(null);
      
      // 通知父组件
      if (onCommentAdd) {
        onCommentAdd(comment);
      }
      
      // 滚动到评论区底部
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error('添加评论失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 点赞评论
  const handleLikeComment = (commentId) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  // 回复评论
  const handleReply = (comment) => {
    setReplyTo(comment);
    setNewComment(`@${comment.author} `);
    textareaRef.current?.focus();
  };

  // 取消回复
  const handleCancelReply = () => {
    setReplyTo(null);
    setNewComment('');
  };

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
    if (e.key === 'Escape' && replyTo) {
      handleCancelReply();
    }
  };

  // 自动调整文本域高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newComment]);

  return (
    <div className="comments">
      <div className="comments__header">
        <h3 className="comments__title">
          评论 ({comments.length})
        </h3>
      </div>

      {/* 评论列表 */}
      <div className="comments__list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment__avatar">
                {getAvatarEmoji(comment.userId)}
              </div>
              <div className="comment__content">
                <div className="comment__header">
                  <span className="comment__author">{comment.author}</span>
                  <span className="comment__time">
                    {formatTime(comment.createTime)}
                  </span>
                </div>
                
                {comment.replyTo && (
                  <div className="comment__reply-info">
                    回复 <span className="comment__reply-target">@{comment.replyTo.author}</span>
                  </div>
                )}
                
                <div className="comment__text">
                  {comment.content}
                </div>
                
                <div className="comment__actions">
                  <button
                    className={`comment__action-btn comment__like-btn ${
                      comment.isLiked ? 'comment__like-btn--active' : ''
                    }`}
                    onClick={() => handleLikeComment(comment.id)}
                    aria-label={comment.isLiked ? '取消点赞' : '点赞'}
                  >
                    <span className="comment__action-icon">
                      {comment.isLiked ? '❤️' : '🤍'}
                    </span>
                    {comment.likes > 0 && (
                      <span className="comment__action-count">
                        {comment.likes}
                      </span>
                    )}
                  </button>
                  
                  <button
                    className="comment__action-btn"
                    onClick={() => handleReply(comment)}
                    aria-label="回复评论"
                  >
                    <span className="comment__action-icon">💬</span>
                    <span className="comment__action-text">回复</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon="💬"
            title="还没有评论"
            description="快来发表第一条评论吧~"
          />
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* 添加评论 */}
      <div className="comments__add">
        {replyTo && (
          <div className="comments__reply-banner">
            <span className="comments__reply-text">
              正在回复 <strong>@{replyTo.author}</strong>
            </span>
            <button
              className="comments__reply-cancel"
              onClick={handleCancelReply}
              aria-label="取消回复"
            >
              ✕
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="comments__form">
          <div className="comments__input-container">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={replyTo ? `回复 @${replyTo.author}...` : "写下你的评论..."}
              className="comments__textarea"
              maxLength={500}
              disabled={isSubmitting}
              rows={1}
            />
            <div className="comments__input-actions">
              <span className="comments__char-count">
                {newComment.length}/500
              </span>
              <button
                type="submit"
                className="comments__submit-btn"
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="comments__loading">发布中...</span>
                ) : (
                  '发布'
                )}
              </button>
            </div>
          </div>
        </form>
        
        <div className="comments__help-text">
          按 Ctrl/Cmd + Enter 快速发布，按 ESC 取消回复
        </div>
      </div>
    </div>
  );
};

export default Comments;