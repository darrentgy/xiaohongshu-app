import { useState, useCallback } from 'react';

// 生成随机评论数据的工具函数
const generateMockComments = (count = 5) => {
  const commentTemplates = [
    '这个分享太实用了！收藏了～',
    '哇，学到了新知识，感谢分享！',
    '我也有类似的经历，确实是这样的',
    '图片拍得真好看，请问用什么设备拍的？',
    '期待更多这样的内容分享',
    '已经按照你的方法试了，真的很有效！',
    '同感同感，深有体会',
    '请问还有其他相关的建议吗？',
    '太赞了，正好需要这个信息',
    '分享得很详细，很有帮助',
    '这个角度很新颖，学习了',
    '写得很棒，支持！',
    '有没有更多细节可以分享？',
    '这个方法我也想试试',
    '感觉很有道理，mark一下'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: Date.now() + i + Math.random(),
    content: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
    author: `用户${(i + 1).toString().padStart(3, '0')}`,
    userId: i + 1,
    createTime: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    likes: Math.floor(Math.random() * 50),
    isLiked: Math.random() > 0.7,
    replyTo: null
  }));
};

// 评论管理 Hook
export const useComments = (postId, initialCount = 0) => {
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(initialCount);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化评论数据
  const initializeComments = useCallback((count) => {
    if (!isInitialized) {
      const mockComments = generateMockComments(Math.floor(Math.random() * 8) + 2);
      setComments(mockComments);
      setCommentsCount(count || mockComments.length);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // 添加评论
  const addComment = useCallback((comment) => {
    const newComment = {
      ...comment,
      id: Date.now() + Math.random(),
      createTime: new Date().toISOString(),
      likes: 0,
      isLiked: false
    };
    
    setComments(prev => [...prev, newComment]);
    setCommentsCount(prev => prev + 1);
    
    return newComment;
  }, []);

  // 点赞评论
  const likeComment = useCallback((commentId) => {
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
  }, []);

  // 删除评论
  const deleteComment = useCallback((commentId) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    setCommentsCount(prev => prev - 1);
  }, []);

  // 获取评论统计信息
  const getCommentsStats = useCallback(() => {
    const totalLikes = comments.reduce((sum, comment) => sum + comment.likes, 0);
    return {
      total: comments.length,
      totalLikes,
      hasComments: comments.length > 0
    };
  }, [comments]);

  return {
    comments,
    commentsCount,
    initializeComments,
    addComment,
    likeComment,
    deleteComment,
    getCommentsStats,
    isInitialized
  };
};

export default useComments;