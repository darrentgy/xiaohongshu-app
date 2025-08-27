import React, { useState, useEffect } from 'react';
import './LoadingStates.css';

// 骨架屏卡片组件
export const SkeletonCard = ({ delay = 0, variant = 'default' }) => {
  const [isVisible, setIsVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  const getRandomHeight = () => {
    // 模拟不同高度的图片，符合瀑布流特性
    const heights = ['240px', '280px', '320px', '300px', '260px'];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  const [imageHeight] = useState(getRandomHeight());

  if (!isVisible) {
    return <div className="skeleton-card skeleton-card--hidden"></div>;
  }

  return (
    <article 
      className={`skeleton-card skeleton-card--${variant}`}
      role="article"
      aria-label="正在加载内容"
      aria-busy="true"
    >
      <div 
        className="skeleton-image"
        style={{ height: imageHeight }}
        aria-label="图片加载中"
      ></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta">
          <div className="skeleton-author"></div>
          <div className="skeleton-stats">
            <div className="skeleton-stat"></div>
            <div className="skeleton-stat"></div>
          </div>
        </div>
      </div>
    </article>
  );
};

// 旋转加载器
export const SpinLoader = ({ size = 'medium', color = 'primary' }) => {
  return (
    <div className={`spin-loader spin-loader--${size} spin-loader--${color}`}>
      <div className="spin-loader__spinner"></div>
    </div>
  );
};

// 加载状态容器
export const LoadingContainer = ({ 
  children, 
  message = '加载中...', 
  showProgress = false,
  progress = 0 
}) => {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <SpinLoader />
      <p className="loading-message" aria-label={message}>{message}</p>
      {showProgress && (
        <ProgressLoader progress={progress} showPercentage={false} />
      )}
      {children}
    </div>
  );
};

// 空状态组件
export const EmptyState = ({ 
  icon = '📝', 
  title = '暂无内容', 
  description = '还没有相关内容，稍后再来看看吧',
  action = null 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
};

// 错误状态组件
export const ErrorState = ({ 
  icon = '😞', 
  title = '出错了', 
  description = '请稍后重试',
  onRetry = null,
  retryText = '重试' 
}) => {
  return (
    <div className="error-state" role="alert" aria-live="assertive">
      <div className="error-state__icon" aria-hidden="true">{icon}</div>
      <h3 className="error-state__title">{title}</h3>
      <p className="error-state__description">{description}</p>
      {onRetry && (
        <button 
          className="error-state__retry" 
          onClick={onRetry}
          type="button"
          aria-label={`${retryText}，${description}`}
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

// 脉冲加载效果
export const PulseLoader = ({ count = 3 }) => {
  return (
    <div className="pulse-loader">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="pulse-loader__dot"></div>
      ))}
    </div>
  );
};

// 进度条加载器
export const ProgressLoader = ({ progress = 0, showPercentage = false }) => {
  return (
    <div className="progress-loader">
      <div className="progress-loader__track">
        <div 
          className="progress-loader__fill"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        ></div>
      </div>
      {showPercentage && (
        <span className="progress-loader__percentage">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

// 列表骨架屏
export const SkeletonList = ({ count = 6 }) => {
  // 根据屏幕大小动态调整骨架屏数量
  const getResponsiveCount = () => {
    if (typeof window === 'undefined') return count;
    
    const width = window.innerWidth;
    if (width < 600) return Math.min(count, 4); // 手机端显示4个
    if (width < 768) return Math.min(count, 6); // 平板端显示6个
    if (width < 1024) return Math.min(count, 8); // 中等屏幕显示8个
    return count; // 大屏幕显示指定数量
  };

  const [skeletonCount, setSkeletonCount] = React.useState(getResponsiveCount());

  React.useEffect(() => {
    const handleResize = () => {
      setSkeletonCount(getResponsiveCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [count]);

  return (
    <div 
      className="skeleton-list"
      role="feed"
      aria-label="正在加载帖子列表"
      aria-busy="true"
    >
      {Array.from({ length: skeletonCount }, (_, index) => (
        <SkeletonCard 
          key={index} 
          delay={index * 100} // 错开动画时间，减少性能压力
          variant={index % 2 === 0 ? 'default' : 'alternate'}
        />
      ))}
    </div>
  );
};