import React from 'react';

const TopBar = ({ title, onSearch, onNotification }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-accent rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">AF</span>
        </div>
        <div>
          <div className="text-xs text-gray-500 uppercase">Management Studio</div>
          {title && <h1 className="text-2xl font-serif">{title}</h1>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {onSearch && (
          <button
            onClick={onSearch}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
        {onNotification && (
          <button
            onClick={onNotification}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors relative"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-accent rounded-full"></span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
