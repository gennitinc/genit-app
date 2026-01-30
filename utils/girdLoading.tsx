import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

const GridLoading = () => {
  return (
          <div className="columns-2 md:columns-4 gap-4 [column-fill:_balance]">
      {[220, 280, 200, 260, 240, 300, 210, 250, 230, 270, 190, 310].map(
        (h, idx) => (
          <div
            key={`skeleton-${idx}`}
            className="mb-4 inline-block w-full align-top"
            style={{ breakInside: "avoid" }}
          >
            <Skeleton
              className="w-full rounded-lg bg-muted/70"
              style={{ height: h }}
            />
          </div>
        ),
      )}
    </div>
  );
}

export default GridLoading;