"use client";

import React from 'react';
import Skeleton from '@/app/components/Common/Skeleton';

export default function Loading() {
  return (
    <div className="container py-5 mt-5">
      {/* Skeleton for Header Section */}
      <div className="mb-5">
        <Skeleton type="title" width="60%" height={40} className="mb-3" />
        <Skeleton count={1} height={20} width="80%" className="mb-2" />
        <Skeleton count={1} height={20} width="40%" />
      </div>

      {/* Grid Skeleton for Content */}
      <div className="row g-4 mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="col-md-4">
            <div className="p-3 border rounded">
              <Skeleton type="rectangle" height={200} className="mb-3" />
              <Skeleton type="title" width="70%" />
              <Skeleton count={2} height={15} />
            </div>
          </div>
        ))}
      </div>

      {/* Large Content Block */}
      <div className="mt-5 pt-5">
        <Skeleton type="rectangle" height={400} />
      </div>
    </div>
  );
}
