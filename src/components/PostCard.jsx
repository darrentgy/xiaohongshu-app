import React, { useState, useRef, useEffect } from 'react';
import './PostCard.css';

const PostCard = ({ post, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);

  // 交叉观察器用于懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleCardClick = (e) => {
    // 防止重复点击
    e.currentTarget.style.pointerEvents = 'none';
    setTimeout(() => {
      if (e.currentTarget) {
        e.currentTarget.style.pointerEvents = 'auto';
      }
    }, 300);
    
    onClick && onClick(post);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(e);
    }
  };

  return (
    <article 
      ref={cardRef}
      className="post-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`查看文章：${post.title}`}
    >
      <div className="post-card__image-container">
        {isInView && (
          <>
            {!imageLoaded && (
              <div className="post-card__image-skeleton">
                <div className="post-card__loading-spinner"></div>
              </div>
            )}
            <img
              src={post.image}
              alt={post.title}
              className={`post-card__image ${
                imageLoaded ? 'post-card__image--loaded' : 'post-card__image--loading'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
            {imageError && (
              <div className="post-card__image-error">
                <span className="post-card__error-icon">🖼️</span>
                <span className="post-card__error-text">图片加载失败</span>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="post-card__content">
        <h3 className="post-card__title">{post.title}</h3>
        <div className="post-card__meta">
          <span className="post-card__author">{post.author}</span>
          <div className="post-card__stats">
            <span className="post-card__stat">
              <span className="post-card__stat-icon" aria-hidden="true">👍</span>
              <span className="post-card__stat-count">{post.likes}</span>
            </span>
            <span className="post-card__stat">
              <span className="post-card__stat-icon" aria-hidden="true">💬</span>
              <span className="post-card__stat-count">{post.comments}</span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="post-card__overlay">
        <span className="post-card__view-text">点击查看</span>
      </div>
    </article>
  );
};

export default PostCard;