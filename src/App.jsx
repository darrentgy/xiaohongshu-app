import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import { LoadingContainer, ErrorState } from './components/LoadingStates';
import './App.css';

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('应用错误:', error, errorInfo);
    this.setState({ errorInfo });
    
    // 错误上报（生产环境可以集成真实的错误监控服务）
    if (process.env.NODE_ENV === 'production') {
      // 这里可以集成 Sentry 等错误监控服务
      console.log('错误已记录，等待上报');
    }
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    
    // 限制重试次数，避免无限重试
    if (retryCount >= 3) {
      // 强制刷新页面
      window.location.reload();
      return;
    }

    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: retryCount + 1 
    });
  };

  render() {
    if (this.state.hasError) {
      const { retryCount } = this.state;
      
      return (
        <div className="app app--error">
          <div className="app__header">
            <div className="app__header-content">
              <h1 className="app__logo">
                <span className="app__logo-icon">🌸</span>
                <span className="app__logo-text">小红书</span>
              </h1>
            </div>
          </div>
          
          <main className="app__main" role="main">
            <ErrorState 
              icon="😵"
              title="页面出错了"
              description={
                retryCount >= 3 
                  ? "应用遇到了持续性问题，即将刷新页面" 
                  : "应用遇到了一些问题，请重试"
              }
              onRetry={this.handleRetry}
              retryText={retryCount >= 3 ? "刷新页面" : "重试"}
            />
          </main>
        </div>
      );
    }

    return this.props.children;
  }
}

// 布局组件
const Layout = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);

  // 网络状态监听
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 页面元数据设置
  useEffect(() => {
    // 设置页面标题
    document.title = '小红书 - 发现美好生活';
    
    // 设置页面描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', '分享美好生活，发现世界的精彩瞬间');
    }

    // 设置移动端视口
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        'content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }

    // 设置主题色
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', '#ff6b6b');

    // 添加苹果设备特定meta标签
    let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleStatusBar) {
      appleStatusBar = document.createElement('meta');
      appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
      document.head.appendChild(appleStatusBar);
    }
    appleStatusBar.setAttribute('content', 'default');

    // 模拟初始加载完成
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // 处理导航点击
  const handleNavClick = useCallback((navItem) => {
    // 这里可以添加导航逻辑
    console.log('导航点击:', navItem);
  }, []);

  // 键盘导航支持
  const handleKeyDown = useCallback((e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  if (isLoading) {
    return <LoadingContainer message="初始化应用..." />;
  }

  return (
    <div className="app">
      {/* 离线状态提示 */}
      {!isOnline && (
        <div className="app__offline-banner" role="alert" aria-live="polite">
          <span className="app__offline-icon">📡</span>
          <span className="app__offline-text">网络连接已断开，部分功能可能受限</span>
        </div>
      )}

      <header className="app__header" role="banner">
        <div className="app__header-content">
          <h1 className="app__logo">
            <span className="app__logo-icon" aria-hidden="true">🌸</span>
            <span className="app__logo-text">小红书</span>
          </h1>
          <nav className="app__nav" role="navigation" aria-label="主导航">
            <button
              className="app__nav-item app__nav-item--active"
              onClick={() => handleNavClick('home')}
              onKeyDown={(e) => handleKeyDown(e, () => handleNavClick('home'))}
              aria-current="page"
              type="button"
            >
              首页
            </button>
          </nav>
        </div>
      </header>
      
      <main className="app__main" role="main">
        <Suspense 
          fallback={
            <LoadingContainer 
              message="加载页面内容..." 
              showProgress={true}
            />
          }
        >
          <Outlet context={{ isOnline }} />
        </Suspense>
      </main>
      
      <footer className="app__footer" role="contentinfo">
        <div className="app__footer-content">
          <p className="app__footer-text">
            © 2024 小红书 App • 发现美好生活
          </p>
        </div>
      </footer>
    </div>
  );
};

// 路由配置
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (
      <div className="app app--error">
        <div className="app__header">
          <div className="app__header-content">
            <h1 className="app__logo">
              <span className="app__logo-icon">🌸</span>
              <span className="app__logo-text">小红书</span>
            </h1>
          </div>
        </div>
        
        <main className="app__main" role="main">
          <ErrorState 
            icon="🚧"
            title="页面找不到"
            description="您访问的页面不存在或已被移除"
            action={
              <button 
                className="error-home-btn"
                onClick={() => window.location.href = '/'}
                type="button"
              >
                返回首页
              </button>
            }
          />
        </main>
      </div>
    ),
    children: [
      {
        index: true,
        element: <PostList />
      },
      {
        path: "post/:id",
        element: <PostDetail />
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

// 主应用组件
function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 全局错误处理
    const handleUnhandledRejection = (event) => {
      console.error('未处理的Promise拒绝:', event.reason);
      
      // 防止默认的错误处理
      event.preventDefault();
      
      // 可以在这里添加错误上报逻辑
      if (process.env.NODE_ENV === 'production') {
        console.log('Promise错误已记录');
      }
    };

    const handleError = (event) => {
      console.error('全局错误:', event.error);
      
      // 可以在这里添加错误上报逻辑
      if (process.env.NODE_ENV === 'production') {
        console.log('全局错误已记录');
      }
    };

    // 页面可见性变化处理
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('页面隐藏，暂停不必要的操作');
      } else {
        console.log('页面可见，恢复操作');
      }
    };

    // 内存警告处理
    const handleMemoryWarning = () => {
      console.warn('内存使用过高，建议清理缓存');
      // 可以在这里添加内存清理逻辑
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 监听内存警告（如果支持）
    if ('memory' in performance) {
      window.addEventListener('memory-warning', handleMemoryWarning);
    }

    // 标记应用已初始化
    setIsInitialized(true);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if ('memory' in performance) {
        window.removeEventListener('memory-warning', handleMemoryWarning);
      }
    };
  }, []);

  // 添加性能监控
  useEffect(() => {
    if (isInitialized) {
      // 监控页面性能
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            console.log('页面加载性能:', {
              loadComplete: entry.loadEventEnd - entry.loadEventStart,
              domInteractive: entry.domInteractive - entry.navigationStart,
              firstPaint: entry.responseEnd - entry.requestStart
            });
          }
        });
      });

      if ('PerformanceObserver' in window) {
        try {
          observer.observe({ entryTypes: ['navigation'] });
        } catch (error) {
          console.warn('性能监控初始化失败:', error);
        }
      }

      return () => {
        if (observer) {
          observer.disconnect();
        }
      };
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return <LoadingContainer message="初始化应用..." />;
  }

  return (
    <ErrorBoundary>
      <RouterProvider 
        router={router}
        fallbackElement={<LoadingContainer message="加载路由..." />}
      />
    </ErrorBoundary>
  );
}

export default App;