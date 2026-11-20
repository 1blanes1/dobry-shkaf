import type { Listing } from '../../entities/listing/types.ts';
import { ListingCard } from './ListingCard/ListingCard.tsx';
import './ListingList.css';

interface ListingListProps {
  listings: Listing[];
}

export function ListingList({ listings }: ListingListProps) {
  return (
    <div className="listings-list">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
