export type ListingExchangeType = 'free' | 'points' | 'barter';

export type ListingStatus =
  | 'draft'
  | 'active'
  | 'reserved'
  | 'completed';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  size?: string;
  condition: string;
  images?: string[];
  // Временная совместимость со старыми записями
  imageUrl?: string;
  exchangeType?: ListingExchangeType;
  pointsCost?: number;
  status?: ListingStatus;
  city: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateListingDto {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  size?: string;
  condition: string;
  images?: string[];
  // Временно оставляем до переделки формы
  imageUrl?: string;
  exchangeType?: ListingExchangeType;
  pointsCost?: number;
  status?: 'draft' | 'active';
  city: string;
  userId: string;
}
