import type { CollectionPoint } from '../../entities/collection-point/types.ts';

import { PointCard } from './PointCard/PointCard.tsx';

interface PointListProps {
  points: CollectionPoint[];
}

export function PointList({ points }: PointListProps) {
  return (
    <div className="points-list">
      {points.map((point) => (
        <PointCard
          key={point.id}
          point={point}
        />
      ))}
    </div>
  );
}