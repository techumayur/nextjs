import React from 'react';
import Skeleton from '@/app/components/Common/Skeleton';

export default function Loading() {
  return (
    <div className="container py-5 mt-5">
      <div className="row g-5">
        <div className="col-lg-7">
          <Skeleton type="rectangle" height={500} className="mb-4" />
          <Skeleton type="title" width="40%" />
          <Skeleton count={10} className="mb-2" />
        </div>
        <div className="col-lg-5">
          <Skeleton type="rectangle" height={300} className="mb-4" />
          <Skeleton type="rectangle" height={400} />
        </div>
      </div>
    </div>
  );
}
