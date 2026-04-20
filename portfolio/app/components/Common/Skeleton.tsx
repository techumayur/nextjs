"use client";

import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  type?: 'text' | 'title' | 'rectangle' | 'circle' | 'card' | 'grid';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  type = 'rectangle', 
  width, 
  height, 
  className = '', 
  count = 1 
}) => {
  const items = Array.from({ length: count });

  const getStyle = () => {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;
    return style;
  };

  const renderSkeleton = (idx: number) => (
    <div 
      key={idx}
      className={`skeleton-base skeleton-${type} ${className} shimmer`}
      style={getStyle()}
    />
  );

  if (type === 'card') {
    return (
      <div className="skeleton-card-container shimmer">
        <div className="skeleton-card-media" />
        <div className="skeleton-card-body">
          <div className="skeleton-title" style={{ width: '60%' }} />
          <div className="skeleton-text" />
          <div className="skeleton-text" style={{ width: '80%' }} />
        </div>
      </div>
    );
  }

  if (type === 'grid') {
    return (
      <div className="row g-4">
        {items.map((_, i) => (
          <div key={i} className="col-md-4">
            <Skeleton type="card" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-group">
      {items.map((_, i) => renderSkeleton(i))}
    </div>
  );
};

export default Skeleton;
