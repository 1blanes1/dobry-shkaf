
import { useEffect, useState } from 'react';

import { Pagination } from '@mui/material';

import type { Listing } from '../../entities/listing/types.ts';
import { ListingCard } from './ListingCard/ListingCard.tsx';

import './ListingList.css';

interface ListingListProps {
  listings: Listing[];
}

const PAGE_SIZE = 9;

export function ListingList({ listings }: ListingListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = Math.ceil(listings.length / PAGE_SIZE);

  // При изменении результатов фильтрации возвращаемся на первую страницу.
  useEffect(() => {
    setCurrentPage(1);
  }, [listings]);

  const visibleListings = listings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="listings-list-wrapper">
      <div className="listings-list">
        {visibleListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {pageCount > 1 && (
        <div className="listings-pagination">
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            siblingCount={1}
            boundaryCount={0}
            shape="rounded"
          />
        </div>
      )}
    </div>
  );
}
