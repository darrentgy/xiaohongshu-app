import React, { Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import { LoadingContainer, ErrorState } from './components/LoadingStates';
import './App.css';

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('应用错误:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="app">
          <div className="app__header">
            <h1 className="app__logo">🌸 小红书</h1>
          </div>
          <ErrorState 
            icon="😵"
            title="页面出错了"
            description="应用遇到了一些问题，请刷新页面重试"
            onRetry={this.handleRetry}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

// 布局组件
const Layout = () => {
  useEffect(() => {
    // 设置页面标题
    document.title = '小红书 - 发现美好生活';
    
    // 设置页面描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', '分享美好生活，发现世界的精彩瞬间');
    }
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <h1 className="app__logo">
            <span className="app__logo-icon">🌸</span>
            <span className="app__logo-text">小红书</span>
          </h1>
          <nav className="app__nav" aria-label="主导航">
            <span className="app__nav-item app__nav-item--active">首页</span>
          </nav>
        </div>
      </header>
      
      <main className="app__main" role="main">
        <Suspense 
          fallback={
            <LoadingContainer message="加载中..." />
          }
        >
          <Outlet />
        </Suspense>
      </main>
      
      <footer className="app__footer">
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
      <div className="app">
        <div className="app__header">
          <h1 className="app__logo">🌸 小红书</h1>
        </div>
        <ErrorState 
          icon="🚧"
          title="页面找不到"
          description="您访问的页面不存在或已被移除"
          action={
            <button 
              className="error-home-btn"
              onClick={() => window.location.href = '/'}
            >
              返回首页
            </button>
          }
        />
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
  useEffect(() => {
    // 全局错误处理
    const handleUnhandledRejection = (event) => {
      console.error('未处理的Promise拒绝:', event.reason);
    };

    const handleError = (event) => {
      console.error('全局错误:', event.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ErrorBoundary>
      <RouterProvider 
        router={router}
        fallbackElement={<LoadingContainer message="初始化中..." />}
      />
    </ErrorBoundary>
  );
}

export default App;