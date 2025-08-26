import React from 'react';
import './LoadingStates.css';

// 骨架屏卡片组件
export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
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
    </div>
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
export const LoadingContainer = ({ children, message = '加载中...' }) => {
  return (
    <div className="loading-container">
      <SpinLoader />
      <p className="loading-message">{message}</p>
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
  onRetry = null 
}) => {
  return (
    <div className="error-state">
      <div className="error-state__icon">{icon}</div>
      <h3 className="error-state__title">{title}</h3>
      <p className="error-state__description">{description}</p>
      {onRetry && (
        <button className="error-state__retry" onClick={onRetry}>
          重试
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
export const SkeletonList = ({ count = 3 }) => {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};