import React from 'react';

interface SkeletonProps {
  count?: number;
}

export const SkeletonListingCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#16261c] rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-800/80 shadow-sm flex flex-col animate-pulse">
      {/* Image Block Skeleton */}
      <div className="relative aspect-4/3 w-full bg-gray-200 dark:bg-gray-800">
        <div className="absolute top-2.5 left-2.5 w-16 h-5 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="absolute bottom-2.5 left-2.5 w-28 h-5 bg-gray-300 dark:bg-gray-700 rounded-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 space-y-2.5">
        {/* Price & Badge */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded-md" />
        </div>

        {/* Title */}
        <div className="h-5 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-md" />

        {/* Location */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded-md" />
        </div>

        {/* Equipments & Footer */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonListingGrid: React.FC<SkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonListingCard key={`skeleton-card-${idx}`} />
      ))}
    </div>
  );
};
