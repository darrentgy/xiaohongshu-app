import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SearchBar.css';

const SearchBar = ({ 
  onSearch, 
  placeholder = "搜索内容...", 
  debounceMs = 300,
  showSuggestions = false,
  suggestions = [],
  maxLength = 100
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // 防抖搜索
  const debouncedSearch = useCallback(
    (searchQuery) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        setIsSearching(false);
        if (onSearch) {
          onSearch(searchQuery.trim());
        }
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  // 处理输入变化
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setQuery(value);
      setShowClearButton(value.length > 0);
      
      if (value.trim()) {
        setIsSearching(true);
        debouncedSearch(value);
      } else {
        setIsSearching(false);
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        if (onSearch) {
          onSearch('');
        }
      }
    }
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      setIsSearching(false);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (onSearch) {
        onSearch(trimmedQuery);
      }
      inputRef.current?.blur();
    }
  };

  // 清空搜索
  const handleClear = () => {
    setQuery('');
    setShowClearButton(false);
    setIsSearching(false);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (onSearch) {
      onSearch('');
    }
    inputRef.current?.focus();
  };

  // 处理焦点事件
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
      if (query) {
        handleClear();
      }
    }
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-bar__form" role="search">
        <div className={`search-bar__input-container ${
          isFocused ? 'search-bar__input-container--focused' : ''
        } ${
          query ? 'search-bar__input-container--has-value' : ''
        }`}>
          <span className="search-bar__icon" aria-hidden="true">
            {isSearching ? (
              <div className="search-bar__loading-spinner"></div>
            ) : (
              '🔍'
            )}
          </span>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-bar__input"
            maxLength={maxLength}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            aria-label="搜索输入框"
            aria-describedby="search-help"
          />
          
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              className="search-bar__clear-button"
              aria-label="清空搜索"
              tabIndex={-1}
            >
              ✕
            </button>
          )}
          
          <div className="search-bar__character-count">
            {query.length}/{maxLength}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="search-bar__submit-button"
          disabled={!query.trim() || isSearching}
          aria-label="执行搜索"
        >
          {isSearching ? (
            <div className="search-bar__button-spinner"></div>
          ) : (
            '搜索'
          )}
        </button>
      </form>
      
      <div id="search-help" className="search-bar__help-text">
        支持按标题、作者名搜索，按 ESC 键清空
      </div>
      
      {/* 搜索建议（如果需要） */}
      {showSuggestions && isFocused && suggestions.length > 0 && query.length > 0 && (
        <div className="search-bar__suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="search-bar__suggestion"
              onClick={() => {
                setQuery(suggestion);
                if (onSearch) {
                  onSearch(suggestion);
                }
              }}
            >
              <span className="search-bar__suggestion-icon">🔍</span>
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;